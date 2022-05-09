import { get, post, put, del } from "./api";
import { Item } from "./models";

export const getItems = () => {
  return get<Item[]>("/kanbanItems");
};

export const batchPutItems = (data: Item[]) => {
  return put("/kanbanItems", data);
};

export const postItems = (data: Item) => {
  return post("/kanbanItem", data);
};

export const deleteItem = (itemId: string) => {
  return del(`/kanbanItem/${itemId}`);
};

export const updateItem = (data: Item) => {
  return put("/kanbanItem", data);
};
