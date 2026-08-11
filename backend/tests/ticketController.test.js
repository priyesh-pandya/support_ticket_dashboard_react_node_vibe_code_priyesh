import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import Module from "node:module";

// The controller is a CommonJS module that uses `require("../models/Ticket")`.
// Vitest's vi.mock only intercepts the ESM module graph, so we also patch
// Node's CJS loader (Module._load) to hand back a shared fake model when the
// controller requires it. This keeps the tests fast and DB-free.
const fakeTicket = { find: vi.fn(), aggregate: vi.fn() };

let getTickets;

beforeAll(async () => {
  const originalLoad = Module._load;
  Module._load = function (request, parent, isMain) {
    if (request.endsWith("models/Ticket")) {
      return fakeTicket;
    }
    return originalLoad.apply(this, arguments);
  };
  ({ getTickets } = await import("../controllers/ticketController.js"));
});

beforeEach(() => {
  vi.clearAllMocks();
  fakeTicket.find.mockReturnValue({ sort: vi.fn().mockResolvedValue([]) });
  fakeTicket.aggregate.mockResolvedValue([]);
});

const makeRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("getTickets", () => {
  it("returns all tickets sorted by createdAt desc by default", async () => {
    const res = makeRes();

    await getTickets({ query: {} }, res);

    expect(fakeTicket.find).toHaveBeenCalledWith({});
    expect(fakeTicket.find.mock.results[0].value.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("searches subject or description case-insensitively", async () => {
    const res = makeRes();

    await getTickets({ query: { search: "login" } }, res);

    const filter = fakeTicket.find.mock.calls[0][0];
    expect(filter.$or[0].subject).toBeInstanceOf(RegExp);
    expect(filter.$or[0].subject.test("Cannot login")).toBe(true);
    expect(filter.$or[1].description.test("LOGIN failed")).toBe(true);
    expect(filter.$or[0].subject.test("billing")).toBe(false);
  });

  it("escapes regex special characters in search input", async () => {
    const res = makeRes();

    await getTickets({ query: { search: "a.b(c)" } }, res);

    const filter = fakeTicket.find.mock.calls[0][0];
    expect(filter.$or[0].subject.test("a.b(c)")).toBe(true);
    expect(filter.$or[0].subject.test("aXbYc")).toBe(false);
  });

  it("filters by status and priority", async () => {
    const res = makeRes();

    await getTickets({ query: { status: "Open", priority: "High" } }, res);

    expect(fakeTicket.find).toHaveBeenCalledWith({ status: "Open", priority: "High" });
  });

  it("sorts by subject ascending when requested", async () => {
    const res = makeRes();

    await getTickets({ query: { sortBy: "subject", sortOrder: "asc" } }, res);

    expect(fakeTicket.find.mock.results[0].value.sort).toHaveBeenCalledWith({ subject: 1 });
  });

  it("sorts by priority weight using aggregation", async () => {
    const res = makeRes();

    await getTickets({ query: { sortBy: "priority", sortOrder: "desc" } }, res);

    expect(fakeTicket.find).not.toHaveBeenCalled();
    expect(fakeTicket.aggregate).toHaveBeenCalledTimes(1);
    const [pipeline] = fakeTicket.aggregate.mock.calls[0];
    expect(pipeline[0]).toEqual({ $match: {} });
    expect(pipeline[2]).toEqual({ $sort: { priorityWeight: -1, _id: -1 } });
  });

  it("applies the filter inside the priority aggregation", async () => {
    const res = makeRes();

    await getTickets({ query: { search: "billing", status: "In Progress", sortBy: "priority" } }, res);

    const [pipeline] = fakeTicket.aggregate.mock.calls[0];
    expect(pipeline[0].$match.status).toBe("In Progress");
    expect(pipeline[0].$match.$or).toBeDefined();
  });

  it("returns 400 for an invalid status", async () => {
    const res = makeRes();

    await getTickets({ query: { status: "Bogus" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Invalid status") }));
    expect(fakeTicket.find).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid sortBy", async () => {
    const res = makeRes();

    await getTickets({ query: { sortBy: "priorityzzz" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Invalid sortBy") }));
  });

  it("returns 400 for an invalid sortOrder", async () => {
    const res = makeRes();

    await getTickets({ query: { sortOrder: "sideways" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Invalid sortOrder") }));
  });

  it("returns 500 when the database call fails", async () => {
    fakeTicket.find.mockReturnValue({ sort: vi.fn().mockRejectedValue(new Error("boom")) });
    const res = makeRes();

    await getTickets({ query: {} }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Failed to fetch tickets", error: "boom" })
    );
  });
});
