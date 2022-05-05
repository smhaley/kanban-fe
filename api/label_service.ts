import { get, post } from "./api";
import {Label} from './models'

export const getLabels = async () => {
  return await get("/label");
};

export const addLabel = async (data: Label) => {
    return await post("/label", data);
  };
  
