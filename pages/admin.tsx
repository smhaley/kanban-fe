import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Update from "../components/admin/update";
import Select from "@mui/material/Select";
import { GetServerSideProps } from "next";
import * as UserService from "../api/user_service";
import * as LabelService from "../api/label_service";
import { Label, User } from "../api/models";
import CircularProgress from "@mui/material/CircularProgress";
import { AxiosError } from "axios";
import { AlertColor } from "@mui/material";
import Typography from "@mui/material/Typography";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = await UserService.getUsers(true);
  const labels = await LabelService.getLabels(true);

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

const alertTypes = {
  conflict: { severity: "error", message: "The value added already exists" },
  bad: { severity: "error", message: "Something went wrong, please try again" },
  success: { severity: "success", message: "Changes successfully saved" },
};

const handleError = (err?: number) => {
  if (err === 409) {
    return alertTypes.conflict;
  } else {
    return alertTypes.bad;
  }
};

enum EditType {
  Label = "Label",
  User = "User",
}

const Admin: NextPage<AdminProps> = ({ users, labels }) => {
  const [label, setLabel] = React.useState(labels);
  const [user, setUser] = React.useState(users);
  const [showAlert, setShowAlert] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alertType, setAlertType] = React.useState(alertTypes.success);
  const [editType, setEditType] = React.useState<EditType>(EditType.Label);

  const transformLabel = (data: Label[]): UpdateData[] => {
    let output: UpdateData[] = [];
    data.forEach((item) => {
      output.push({ id: item.id, value: item.label });
    });
    return output;
  };
  const transformUser = (data: User[]): UpdateData[] => {
    let output: UpdateData[] = [];
    data.forEach((item) => {
      output.push({ id: item.id, value: item.username });
    });
    return output;
  };

  const refreshLabels = async () => {
    const resp = await LabelService.getLabels();
    setLabel(resp);
  };

  const refreshUsers = async () => {
    const resp = await UserService.getUsers();
    setUser(resp);
  };

  const addValue = async (newVal: string) => {
    setLoading(true);
    try {
      if (editType === EditType.Label) {
        await LabelService.addLabel({ id: 999, label: newVal.toLowerCase() });
        await refreshLabels();
      } else {
        await UserService.addUser({ id: 999, username: newVal.toLowerCase() });
        await refreshUsers();
      }
      setAlertType(alertTypes.success);
    } catch (e) {
      const err = (e as AxiosError)?.response?.status;
      setAlertType(handleError(err));
    }
  };

  const updateValue = async (item: UpdateData) => {
    setLoading(true);
    const { id, value } = item;
    try {
      if (editType === EditType.Label) {
        await LabelService.updateLabel({ id, label: value.toLowerCase() });
        await refreshLabels();
      } else {
        await UserService.updateUser({ id, username: value.toLowerCase() });
        await refreshUsers();
      }
      setAlertType(alertTypes.success);
    } catch (e) {
      const err = (e as AxiosError)?.response?.status;
      setAlertType(handleError(err));
    }
  };

  const deleteValue = async (id: number) => {
    setLoading(true);
    try {
      if (editType === EditType.Label) {
        await LabelService.deleteLabel(id);
        await refreshLabels();
      } else {
        await UserService.deleteUser(id);
        await refreshUsers();
      }
      setAlertType(alertTypes.success);
    } catch (e) {
      const err = (e as AxiosError)?.response?.status;
      setAlertType(handleError(err));
    }
  };

  React.useEffect(() => {
    const alert = setTimeout(() => setShowAlert(false), 3000);
    return () => clearTimeout(alert);
  }, [showAlert]);

  React.useEffect(() => {
    if (loading) {
      const closeOutReq = () => {
        setLoading(false);
        setShowAlert(true);
      };
      const alert = setTimeout(() => closeOutReq(), 2000);
      return () => clearTimeout(alert);
    }
  }, [loading]);

  return (
    <Container maxWidth="md" style={{ width: "100%" }}>
      {showAlert && (
        <Box
          sx={{
            position: "absolute",
            top: 60,
            left: "50%",
            width: "60%",
            transform: "translate(-50%, 0)",
          }}
        >
          <Alert severity={alertType.severity as AlertColor}>
            {alertType.message}
          </Alert>
        </Box>
      )}
      <Box
        sx={{
          my: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ minHeigh: 500 }}>
          <Box sx={{ width: 250, mx: 4, my: 4 }}>
            <Typography variant="h4" sx={{ pb: 2 }}>
              Admin Editor
            </Typography>
            <InputLabel id="edit-select-label">Select Edit View</InputLabel>
            <Select
              labelId="edit-select-label"
              id="edit-select"
              value={editType}
              style={{ width: "100%", textTransform: "capitalize" }}
              disabled={loading}
              onChange={(e) => setEditType(e.target.value as EditType)}
            >
              {Object.values(EditType).map((val) => (
                <MenuItem
                  key={val}
                  value={val}
                  style={{ textTransform: "capitalize" }}
                >
                  {val}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ m: 2, minHeigh: 500 }}>
            {loading ? (
              <Box sx={{ width: "100%", height: 250 }}>
                <Box
                  sx={{
                    display: "flex",
                    pt: 8,
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress color="secondary" />
                </Box>
              </Box>
            ) : (
              <Update
                key={editType}
                type={editType}
                data={
                  editType === EditType.Label
                    ? transformLabel(label)
                    : transformUser(user)
                }
                updateValue={updateValue}
                deleteValue={deleteValue}
                addValue={addValue}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Admin;
