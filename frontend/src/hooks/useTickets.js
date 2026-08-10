import { useCallback, useEffect, useState } from "react";
import { getTickets, createTicket, deleteTicket } from "../api/tickets.js";

export default function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const addTicket = async (payload) => {
    setSubmitting(true);
    try {
      const ticket = await createTicket(payload);
      setTickets((prev) => [ticket, ...prev]);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    } finally {
      setSubmitting(false);
    }
  };

  const removeTicket = async (id) => {
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((ticket) => ticket._id !== id));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    }
  };

  return { tickets, loading, submitting, fetchTickets, addTicket, removeTicket };
}
