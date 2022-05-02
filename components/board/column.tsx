import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useDrop } from "react-dnd";

export const dropChecker = (title: string, currentColumn: string) => {
  return (
    currentColumn === title ||
    (currentColumn === "Backlog" && title == "In Progress") ||
    (currentColumn === "In Progress" &&
      (title === "Blocked" || title === "In Review" || title === "Backlog")) ||
    (currentColumn === "In Review" &&
      (title === "Complete" || title === "Blocked")) ||
    (currentColumn === "Blocked" &&
      (title === "In Progress" || title === "Backlog"))
  );
};

interface ColumnProps {
  title: string;
  children?: JSX.Element[];
}
export default function Column({ children, title }: ColumnProps) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "Our first type",
    drop: () => ({ name: title }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    canDrop: (item: { id: number; currentColumn: string }) => {
      const { currentColumn } = item;
      return dropChecker(title, currentColumn);
    },
  });

  const getBackgroundColor = () => {
    if (isOver) {
      if (canDrop) {
        return "yellow";
      } else if (!canDrop) {
        return "purple";
      }
    }
  };

  return (
    <Paper
      ref={drop}
      sx={{ minHeight: "80vh", width: 180, background: getBackgroundColor() }}
    >
      <Box sx={{ textAlign: "center", mb: 2, pt: 1 }}>
        <Typography variant="h6">{title}</Typography>
      </Box>

      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {children}
      </Box>
    </Paper>
  );
}
