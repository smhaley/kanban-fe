import { get, post } from "./api";
import { User } from "./models";

export const getUsers = async () => {
  return await get<User[]>("/user");
};

export const addUser = async (data: User) => {
  return await post("/user", data);
};
