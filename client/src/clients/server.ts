import axios from "axios";

const Server = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export default Server;