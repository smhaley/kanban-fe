import { get, post, put, del } from "./api";
import { Item, NewItem } from "./models";

export const getItems = () => {
  return get<Item[]>("/kanbanItem");
};

export const batchPutItems = (data: Item[]) => {
  return put("/kanbanItem", data);
};

export const postItems = (data: NewItem) => {
  return post("/kanbanItem", data);
};

export const deleteItem = (itemId: string) => {
  return del(`/kanbanItem/${itemId}`);
};

export const updateItem = (data: Item) => {
  return put("/kanbanItem", data);
};
