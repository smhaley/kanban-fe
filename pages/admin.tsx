import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Board from "../components/board/board";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Update from "../components/admin/update";
import Snackbar from "@mui/material/Snackbar";
import { GetServerSideProps } from "next";
import * as UserService from "../api/user_service";
import * as LabelService from "../api/label_service";
import { Label, User } from "../api/models";
import CircularProgress from "@mui/material/CircularProgress";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

type UpdateData = {
  id: number;
  value: string;
};

interface AdminProps {
  labels: Label[];
  users: User[];
}
const Admin: NextPage<AdminProps> = ({ users, labels }) => {
  const [label, setLabel] = React.useState(labels);
  const [user, setUser] = React.useState(users);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  console.log(user, label);

  const tranformLabel = (data: Label[]): UpdateData[] => {
    let output: UpdateData[] = [];
    data.forEach((item) => {
      output.push({ id: item.id, value: item.label });
    });
    return output;
  };
  const tranformUser = (data: User[]): UpdateData[] => {
    let output: UpdateData[] = [];
    data.forEach((item) => {
      output.push({ id: item.id, value: item.username });
    });
    return output;
  };

  const handleSnackClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };
  console.log(label);

  const refreshLabels = async () => {
    const resp = await LabelService.getLabels();
    setLabel(resp);
  };

  const refreshUsers = async () => {
    const resp = await UserService.getUsers();
    setUser(resp);
  };

  const addLabel = async (newLabel: string) => {
    setLoading(true);
    await LabelService.addLabel({ id: 999, label: newLabel });
    await refreshLabels();
    setSnackOpen(true);
    closeLoader();
  };

  const updateLabel = async (item: UpdateData) => {
    setLoading(true);
    const { id, value } = item;
    await LabelService.updateLabel({ id, label: value });
    await refreshLabels();
    setSnackOpen(true);
    setLoading(false);
  };
  const deleteLabel = async (id: number) => {
    setLoading(true);
    await LabelService.deleteLabel(id);
    await refreshLabels();
    setSnackOpen(true);
    setLoading(false);
  };

  const closeLoader = () => {
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <Container maxWidth="md" style={{ width: "100%" }}>
      <Box
        sx={{
          my: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ minHeigh: 500 }}>
          <Typography variant="h5" m={2} gutterBottom component="div">
            Label Tools
          </Typography>
          <Box sx={{ m: 2, minHeigh: 500 }}>
            {loading ? (
              <CircularProgress color="secondary" />
            ) : (
              <Update
                type={"Label"}
                data={tranformLabel(label)}
                updateValue={updateLabel}
                deleteValue={deleteLabel}
                addValue={addLabel}
              />
            )}
          </Box>
        </Paper>

        {/* <Paper>
          <Typography variant="h5" m={2} gutterBottom component="div">
            User Tools
          </Typography>
          <Box sx={{ m: 2 }}>
            <Update
              type={"Label"}
              data={tranformLabel(labels)}
              updateValue={() => {}}
              deleteValue={() => {}}
              addValue={() => {}}
            />
          </Box>
        </Paper> */}
      </Box>
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
      >
        <Alert
          onClose={handleSnackClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          This is a success message!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin;
