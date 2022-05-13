import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { forwardRef } from "react";
import NextLink from "next/link";
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
      <Box sx={{ mt: 5 }}>
        <Paper sx={{ minHeigh: 500, display: "flex", flexWrap: "wrap" }}>
          <Typography variant="h4" sx={{ p: 2 }}>
            Archive
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {archivedItems.map((item) => (
              <Card
                key={item.id}
                sx={{
                  width: 225,
                  m: 2,
                  minHeight: 50,
                }}
              >
                <ItemContent item={item} />
                <Box>
                  <NextLink href={`/item/${item.id}`} passHref>
                    <Button>See Details</Button>
                  </NextLink>
                </Box>
              </Card>
            ))}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Archive;
