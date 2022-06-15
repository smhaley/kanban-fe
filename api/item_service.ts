import { get, post, put, del } from "./api";
import { Item } from "./models";

export const getItems = (serverSide?: boolean, queryString?: string) => {
  const service = "/kanbanItems";
  const endpoint = queryString ? service + queryString : service;

  return get<Item[]>(endpoint, serverSide);
};

export const getItem = (id: string, serverSide?: boolean) => {
  return get<Item>(`/kanbanItem/${id}`, serverSide);
};

export const getArchivedItems = (serverSide?: boolean) => {
  return get<Item[]>(`/archivedKanbanItems`, serverSide);
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
