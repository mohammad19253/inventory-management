import { default as Axios } from "axios";

const axios = Axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios;
