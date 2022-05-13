import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { GetServerSideProps } from "next";
import * as ItemService from "../api/item_service";
import { Item } from "../api/models";
import ItemContent from "../components/shared/item-card-content";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const archivedItems = await ItemService.getArchivedItems();

  if (!archivedItems) {
    return {
      notFound: true,
    };
  }
  return {
    props: { archivedItems },
  };
};

interface ArchiveProps {
  archivedItems: Item[];
}

const Archive: NextPage<ArchiveProps> = ({ archivedItems }) => {
  return (
    <Container maxWidth="md" style={{ width: "100%" }}>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ pb: 1 }}>
          {" "}
          Archive
        </Typography>
        <Paper sx={{ minHeigh: 500, display: "flex", flexWrap: "wrap" }}>
          {archivedItems.map((item) => (
            <Card key={item.id} sx={{ width: 225, m: 2 }}>
              <ItemContent item={item} />
            </Card>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default Archive;
