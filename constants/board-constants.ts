import { Priority, Item, ItemStatus } from "../api/models";

export const emptyItem: Item = {
  id: "",
  content: "",
  title: "",
  label: "",
  user: "",
  updateDateTime: "",
  creationDateTime: "",
  itemStatus: ItemStatus.BACKLOG,
  priority: Priority.STANDARD,
  position: 999,
};
