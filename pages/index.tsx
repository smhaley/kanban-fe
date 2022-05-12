import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Board from "../components/board/board";
import * as UserService from "../api/user_service";
import * as LabelService from "../api/label_service";
import { User, Label } from "../api/models";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = await UserService.getUsers();
  const labels = await LabelService.getLabels();
  if (!users || !labels) {
    return {
      notFound: true,
    };
  }
  return {
    props: { labels, users },
  };
};

interface HomeProps {
  labels: Label[];
  users: User[];
}

const Home: NextPage<HomeProps> = ({ users, labels }: HomeProps) => {
  return (
    <Container style={{ width: "100%" }}>
      <Box
        sx={{
          my: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Board users={users} labels={labels} />
      </Box>
    </Container>
  );
};

export default Home;
