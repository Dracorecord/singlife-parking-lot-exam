import axios from "axios";

export const publicClient = axios.create({
  baseURL: process.env.REACT_APP_API,
});
