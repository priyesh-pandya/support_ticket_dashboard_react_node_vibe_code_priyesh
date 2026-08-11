import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getTickets = (params = {}) => api.get("/tickets", { params }).then((res) => res.data);

export const getTicketById = (id) =>
  api.get(`/tickets/${id}`).then((res) => res.data);

export const createTicket = (payload) =>
  api.post("/tickets", payload).then((res) => res.data);

export const deleteTicket = (id) =>
  api.delete(`/tickets/${id}`).then((res) => res.data);
