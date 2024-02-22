import axios from "axios";
import { API_URL } from "./constant";

const API_CALL = axios.create({ baseURL: API_URL });

export default API_CALL;
