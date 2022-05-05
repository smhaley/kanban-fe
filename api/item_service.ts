import { get, post, put } from "./api";
import { Item } from "./models";

export const getItems = () => {
  return get<Item[]>("/kanbanItem");
};

export const batchPutItems = (data: Item[]) => {
  return put("/kanbanItem", data);
};

// export const addLabel = async (data: Label) => {
//   return await post("/label", data);
// };
