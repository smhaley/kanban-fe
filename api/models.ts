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
  ARCHIVE = "ARCHIVE",
}

export interface User {
  id: number;
  username: string;
}

export interface Label {
  id: number;
  label: string;
}

export interface Item {
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
