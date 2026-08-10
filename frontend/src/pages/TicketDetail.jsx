import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicketById } from "../api/tickets.js";
import Header from "../components/Header.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import PriorityBadge from "../components/PriorityBadge.jsx";

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");

    getTicketById(id)
      .then((data) => {
        setTicket(data);
      })
      .catch((err) => {
        const message = err?.response?.data?.message || err.message || "Unable to load ticket";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm text-slate-500">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold text-rose-600">{error}</p>
          <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            Back to tickets
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Ticket ID #{ticket._id.slice(-6).toUpperCase()}</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">{ticket.subject}</h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Back to tickets
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Description</h2>
              <p className="text-sm leading-7 text-slate-700">{ticket.description}</p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Created</h2>
              <p className="text-sm text-slate-700">{new Date(ticket.createdAt).toLocaleString()}</p>
            </section>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
              <div className="mt-3">
                <StatusBadge status={ticket.status} />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Priority</p>
              <div className="mt-3">
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Ticket details</p>
              <div className="mt-3 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">ID:</span> {ticket._id}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Created:</span> {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
