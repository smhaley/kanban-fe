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
import Router from "next/router";
import styled from "@emotion/styled";

const StyledCard = styled(Card)`
  transition: all .25s linear;
    box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.4);
  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`;

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
  const handleCardClick = (id: string) => Router.push(`/item/${id}`);
  return (
    <Container maxWidth="md" style={{ width: "100%" }}>
      <Box sx={{ mt: 5 }}>
        <Paper sx={{ minHeigh: 500 }}>
          <Typography variant="h4" sx={{ p: 2 }}>
            Archive
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {archivedItems.map((item) => (
              <StyledCard
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                sx={{
                  width: 225,
                  m: 2,
                  minHeight: 50,
                  alignSelf: "start",
                  cursor: "pointer",
                }}
              >
                <ItemContent item={item} isSmall={false} />
              </StyledCard>
            ))}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Archive;
