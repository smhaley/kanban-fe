import * as React from "react";
import { getLabels } from "../api/label_service";
import { getUsers } from "../api/user_service";
import { Label, User } from "../api/models";

interface AppContext {
  labels: Label[];
  users: User[];
  updateLabels: () => void;
  updateUsers: () => void;
}

const AppContext = React.createContext<AppContext>({
  labels: [],
  users: [],
  updateLabels: () => {},
  updateUsers: () => {},
});

interface Props {
  children: any;
}

export default function LabelWrapper({ children }: Props) {
  const [labels, setLabels] = React.useState<Label[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);

  const triggerLabelUpdate = async () => {
    try {
      const resp = await getLabels();
      setLabels(resp);
    } catch (e) {
      console.log(e);
    }
  };

  const triggerUserUpdate = async () => {
    try {
      const resp = await getUsers();
      setUsers(resp);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    triggerLabelUpdate();
    triggerUserUpdate();
  }, []);

  return (
    <AppContext.Provider
      value={{
        labels,
        users,
        updateLabels: triggerLabelUpdate,
        updateUsers: triggerUserUpdate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return React.useContext(AppContext);
}
