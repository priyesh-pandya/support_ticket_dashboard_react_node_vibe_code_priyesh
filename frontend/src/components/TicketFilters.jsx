import { useEffect, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineChevronDown, HiXMark } from "react-icons/hi2";
import { isFilterActive } from "../hooks/useTickets.js";

const STATUSES = ["Open", "In Progress", "Resolved"];
const PRIORITIES = ["Low", "Medium", "High"];

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "priority:desc", label: "Priority: High → Low" },
  { value: "priority:asc", label: "Priority: Low → High" },
  { value: "subject:asc", label: "Subject: A → Z" },
  { value: "subject:desc", label: "Subject: Z → A" },
];

function SelectField({ id, value, onChange, options, ariaLabel }) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-3.5 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <HiOutlineChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={16}
      />
    </div>
  );
}

export default function TicketFilters({ filters, onChange, onReset, resultCount, loading }) {
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search input — only push to parent 300ms after the user stops typing
  useEffect(() => {
    if (searchInput === filters.search) return;
    const timer = setTimeout(() => onChange({ search: searchInput }), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Sync local input when the parent value changes externally (e.g. reset)
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const isFiltered = isFilterActive(filters);

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(":");
    onChange({ sortBy, sortOrder });
  };

  const handleReset = () => {
    setSearchInput("");
    onReset();
  };

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by subject or description..."
            aria-label="Search tickets"
            className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex">
          <SelectField
            id="status-filter"
            ariaLabel="Filter by status"
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
            options={[{ value: "", label: "All statuses" }, ...STATUSES.map((s) => ({ value: s, label: s }))]}
          />
          <SelectField
            id="priority-filter"
            ariaLabel="Filter by priority"
            value={filters.priority}
            onChange={(e) => onChange({ priority: e.target.value })}
            options={[{ value: "", label: "All priorities" }, ...PRIORITIES.map((p) => ({ value: p, label: p }))]}
          />
          <SelectField
            id="sort-select"
            ariaLabel="Sort tickets"
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
          />
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 lg:self-auto"
          >
            <HiXMark size={16} />
            Clear
          </button>
        )}
      </div>

      <div className="text-xs font-medium text-slate-500">
        {loading ? "Loading tickets..." : `${resultCount} ${resultCount === 1 ? "ticket" : "tickets"}${isFiltered ? " found" : ""}`}
      </div>
    </div>
  );
}
