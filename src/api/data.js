// export const API_URL = "http://localhost:8000";

export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://10.1.104.4:5000";
