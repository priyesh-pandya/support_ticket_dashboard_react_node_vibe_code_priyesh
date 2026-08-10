import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import TicketTable from "./TicketTable.jsx";

describe("TicketTable delete action", () => {
  const ticket = {
    _id: "507f1f77bcf86cd799439011",
    subject: "Login not working",
    status: "Open",
    priority: "High",
    createdAt: "2024-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("asks for confirmation and deletes when confirmed", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<TicketTable tickets={[ticket]} loading={false} onCreate={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getAllByRole("button", { name: /delete ticket/i })[0]);

    expect(window.confirm).toHaveBeenCalledWith("Delete this ticket? This action cannot be undone.");
    expect(onDelete).toHaveBeenCalledWith(ticket._id);
  });

  it("does not delete when confirmation is canceled", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<TicketTable tickets={[ticket]} loading={false} onCreate={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getAllByRole("button", { name: /delete ticket/i })[0]);

    expect(onDelete).not.toHaveBeenCalled();
  });
});
