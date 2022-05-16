import { Item, ItemStatus } from "../api/models";
import { dropChecker } from "./board-utils";

export const getDate = (iso: string) => {
  const date = new Date(iso);
  return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString(
    "en-US"
  )}`;
};

export const getItemStatusOptions = (isArchived: boolean, item: Item) => {
  if (isArchived) {
    return Object.values(ItemStatus).filter(
      (status) => status === ItemStatus.ARCHIVE
    );
  } else {
    return Object.values(ItemStatus).filter(
      (status) => dropChecker(status, item.itemStatus) === false
    );
  }
};
