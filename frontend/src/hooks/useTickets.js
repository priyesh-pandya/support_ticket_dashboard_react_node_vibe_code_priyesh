import { useCallback, useEffect, useState } from "react";
import { getTickets, createTicket, deleteTicket } from "../api/tickets.js";

const DEFAULT_FILTERS = {
  search: "",
  status: "",
  priority: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

// Builds the axios query params object, omitting empty filter values
const buildParams = (filters) => {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  params.sortBy = filters.sortBy;
  params.sortOrder = filters.sortOrder;
  return params;
};

// True when any filter/sort differs from the defaults
export const isFilterActive = (filters) =>
  Boolean(filters.search || filters.status || filters.priority) ||
  filters.sortBy !== "createdAt" ||
  filters.sortOrder !== "desc";

export default function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTickets(buildParams(filters));
      setTickets(data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateFilters = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

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

  return {
    tickets,
    loading,
    submitting,
    filters,
    updateFilters,
    resetFilters,
    fetchTickets,
    addTicket,
    removeTicket,
  };
}
