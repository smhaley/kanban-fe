export enum Priority {
  LOW = "LOW",
  STANDARD = "STANDARD",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum ItemStatus {
  BACKLOG = "BACKLOG",
  IN_PROGRESS = "IN_PROGRESS",
  BLOCKED = "BLOCKED",
  IN_REVIEW = "IN_REVIEW",
  COMPLETE = "COMPLETE",
}

export const labelPrettify = (val: string) => {
  return val
    .toLowerCase()
    .split("_")
    .map((word) => {
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export interface User {
  id: number;
  username: string;
}

export interface Label {
  id: number;
  label: string;
}

export interface NewItem {
  label: string;
  user: string;
  content: string;
  itemStatus: ItemStatus;
  priority: Priority;
  position: number;
  title: string;
  id: string;
  updateDateTime: string;
  creationDateTime: string;
}

export interface Item extends NewItem {
  id: string;
  updateDateTime: string;
  creationDateTime: string;
}

// for post make id, and times nullable; position is needed
