export enum Priority {
    LOW = "LOW",
    STANDARD = "STANDARD",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL",
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
  id: string;
  label: string;
  user: string;
  content: string;
  updateDateTime: string;
  itemStatus: string;
  creationDateTime: string;
  priority: Priority;
  position: number;
  title: string;
}
