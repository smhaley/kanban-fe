import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const serverSideDomain =
  process.env.NODE_ENV === "production" ? process.env.DOCKER_API : "localhost";

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
  "X-Requested-With": "XMLHttpRequest",
};

const http = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers,
});

const ssHttp = axios.create({
  baseURL: `http://${serverSideDomain}:8080/api/v1`,
  headers,
});

export async function get<T>(
  url: string,
  serverSide?: boolean,
  config?: AxiosRequestConfig
) {
  try {
    let resp: AxiosResponse<T, any>;
    if (serverSide) {
      resp = await ssHttp.get<T>(url, config);
    } else {
      resp = await http.get<T>(url, config);
    }
    return await resp.data;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function post<T>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig
) {
  try {
    const resp = await http.post<T>(url, data, config);
    return resp.data;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function del<T>(url: string, config?: AxiosRequestConfig) {
  try {
    const resp = await http.delete<T>(url, config);
    return resp.data;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function put<T>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig
) {
  try {
    const resp = await http.put<T>(url, data, config);
    return resp.data;
  } catch (e) {
    return Promise.reject(e);
  }
}
