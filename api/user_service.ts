import { get, post, put, del } from "./api";
import { User } from "./models";

export const getUsers = async () => {
  return await get<User[]>("/user");
};

export const addUser = async (data: User) => {
  return await post("/user", data);
};

export const updateUser = async (data: User) => {
  return await put(`/user/${data.id}`, data);
};

export const deleteUser = async (id: number) => {
  return await del(`/user/${id}`);
};

