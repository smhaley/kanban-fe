import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Droppable } from "react-beautiful-dnd";
import { labelPrettify } from "../../utils/shared";
import { ItemStatus } from "../../api/models";
import { dropChecker } from "../../utils/board-utils";

interface BoardProps {
  columnId: ItemStatus;
  children: JSX.Element[];
  currentDragId?: ItemStatus;
}

export default function Column({
  columnId,
  children,
  currentDragId,
}: BoardProps) {
  const isDroppable = dropChecker(columnId, currentDragId);

  return (
    <Droppable
      droppableId={columnId}
      key={columnId}
      isDropDisabled={isDroppable}
    >
      {(provided, snapshot) => {
        return (
          <Grid item>
            <Box sx={{ textAlign: "center", mb: 1, pt: 1 }}>
              <Typography variant="h6">{labelPrettify(columnId)}</Typography>
            </Box>
            <Paper
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                background: snapshot.isDraggingOver ? "#cdafff" : "#ececec",
                padding: 1,
                width: 180,
                minHeight: 500,
              }}
            >
              {children}
              {provided.placeholder}
            </Paper>
          </Grid>
        );
      }}
    </Droppable>
  );
}
