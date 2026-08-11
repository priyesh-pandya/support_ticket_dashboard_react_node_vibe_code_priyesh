import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TicketFilters from "./TicketFilters.jsx";

const defaultFilters = {
  search: "",
  status: "",
  priority: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

function setup(filters = defaultFilters, onChange = vi.fn(), onReset = vi.fn()) {
  return render(
    <TicketFilters
      filters={filters}
      onChange={onChange}
      onReset={onReset}
      resultCount={2}
      loading={false}
    />
  );
}

describe("TicketFilters", () => {
  it("renders search, status, priority and sort controls", () => {
    setup();
    expect(screen.getByLabelText("Search tickets")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by status")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by priority")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort tickets")).toBeInTheDocument();
  });

  it("shows the result count", () => {
    setup();
    expect(screen.getByText("2 tickets")).toBeInTheDocument();
  });

  it("debounces search input and calls onChange with the search term", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    setup(defaultFilters, onChange);

    await user.type(screen.getByLabelText("Search tickets"), "login");

    await waitFor(() => expect(onChange).toHaveBeenCalledWith({ search: "login" }), { timeout: 1500 });
  });

  it("calls onChange with status when the status filter changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    setup(defaultFilters, onChange);

    await user.selectOptions(screen.getByLabelText("Filter by status"), "Open");

    expect(onChange).toHaveBeenCalledWith({ status: "Open" });
  });

  it("calls onChange with priority when the priority filter changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    setup(defaultFilters, onChange);

    await user.selectOptions(screen.getByLabelText("Filter by priority"), "High");

    expect(onChange).toHaveBeenCalledWith({ priority: "High" });
  });

  it("maps the combined sort value back to sortBy and sortOrder", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    setup(defaultFilters, onChange);

    await user.selectOptions(screen.getByLabelText("Sort tickets"), "priority:desc");

    expect(onChange).toHaveBeenCalledWith({ sortBy: "priority", sortOrder: "desc" });
  });

  it("only shows the clear button when a filter is active", () => {
    const { rerender } = setup(defaultFilters);
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();

    rerender(
      <TicketFilters
        filters={{ ...defaultFilters, status: "Open" }}
        onChange={vi.fn()}
        onReset={vi.fn()}
        resultCount={1}
        loading={false}
      />
    );
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("calls onReset when clear is clicked and clears the search input", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    const { rerender } = render(
      <TicketFilters
        filters={{ ...defaultFilters, search: "login", status: "Open" }}
        onChange={vi.fn()}
        onReset={onReset}
        resultCount={0}
        loading={false}
      />
    );

    await user.click(screen.getByRole("button", { name: /clear/i }));
    expect(onReset).toHaveBeenCalled();

    rerender(
      <TicketFilters
        filters={defaultFilters}
        onChange={vi.fn()}
        onReset={onReset}
        resultCount={0}
        loading={false}
      />
    );
    expect(screen.getByLabelText("Search tickets")).toHaveValue("");
  });
});
