import { get, post, put, del } from "./api";
import { Label } from "./models";

export const getLabels = async () => {
  return await get<Label[]>("/label");
};

export const addLabel = async (data: Label) => {
  return await post("/label", data);
};

export const updateLabel = async (data: Label) => {
  return await put(`/label/${data.id}`, data);
};

export const deleteLabel = async (id: number) => {
  return await del(`/label/${id}`);
};

