import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TicketDetail from "./TicketDetail.jsx";
import * as ticketsApi from "../api/tickets.js";

describe("TicketDetail page", () => {
  it("renders ticket details after fetching data", async () => {
    const fakeTicket = {
      _id: "ticket123",
      subject: "Test subject",
      description: "Test description",
      status: "Open",
      priority: "High",
      createdAt: "2026-08-07T00:00:00.000Z",
    };

    vi.spyOn(ticketsApi, "getTicketById").mockResolvedValue(fakeTicket);

    render(
      <MemoryRouter initialEntries={["/tickets/ticket123"]}>
        <Routes>
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Test subject/i)).toBeInTheDocument());
    expect(screen.getByText(/Test description/i)).toBeInTheDocument();
    expect(screen.getByText(/Open/i)).toBeInTheDocument();
    expect(screen.getByText(/High/i)).toBeInTheDocument();
  });
});
