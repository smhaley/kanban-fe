import React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Item, Priority } from "../../api/models";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { labelPrettify, priorityColorMapper } from "../../utils/shared";

export interface ItemContentProps {
  item: Item;
}

export default function ItemContent({ item }: ItemContentProps) {
  return (
    <CardContent>
      <Typography variant="h6" sx={{ lineHeight: 1, pb: 1 }}>
        {item.title}
      </Typography>
      <Stack
        direction="column"
        spacing={1}
        sx={{ textTransform: "capitalize" }}
      >
        <Chip
          sx={{ p: 1 }}
          color="secondary"
          variant="outlined"
          label={item.user}
        />
        <Chip sx={{ p: 1 }} variant="outlined" label={item.label} />
        <Chip
          color={priorityColorMapper(item.priority)}
          label={labelPrettify(item.priority)}
        />
      </Stack>
    </CardContent>
  );
}
