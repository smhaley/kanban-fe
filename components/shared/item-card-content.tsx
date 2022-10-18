import React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Item } from "../../api/models";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { labelPrettify, priorityColorMapper } from "../../utils/shared";

export interface ItemContentProps {
  item: Item;
  isSmall: boolean;
}

export default function ItemContent({ item, isSmall }: ItemContentProps) {
  const chipSize = isSmall ? "small" : "medium";
  return (
    <>
      <Typography
        sx={{ fontSize: isSmall ? 14 : 18, pl: 3, pt: 2, lineHeight: 1.25 }}
      >
        {item.title}
      </Typography>
      <CardContent>
        <Stack
          direction="column"
          spacing={1}
          sx={{ textTransform: "capitalize" }}
        >
          <Chip
            sx={{ p: 1, pointerEvents: "none" }}
            color="secondary"
            size={chipSize}
            variant="outlined"
            label={item.user}
          />
          <Chip
            sx={{ p: 1, pointerEvents: "none" }}
            variant="outlined"
            size={chipSize}
            label={item.label}
          />
          <Chip
            sx={{ pointerEvents: "none" }}
            size={chipSize}
            color={priorityColorMapper(item.priority)}
            label={labelPrettify(item.priority)}
          />
        </Stack>
      </CardContent>
    </>
  );
}
