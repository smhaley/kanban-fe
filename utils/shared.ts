import { Priority } from "../api/models";

export const labelPrettify = (val: string) => {
  return val
    .toLowerCase()
    .split("_")
    .map((word) => {
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const priorityColorMapper = (priority: Priority) => {
  if (priority === Priority.CRITICAL) {
    return "error";
  } else if (priority === Priority.HIGH) {
    return "warning";
  } else if (priority === Priority.STANDARD) {
    return "info";
  } else {
    return "success";
  }
};

export const getDate = (iso: string) => {
  const date = new Date(iso);
  return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString(
    "en-US"
  )}`;
};
