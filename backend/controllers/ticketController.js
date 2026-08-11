const Ticket = require("../models/Ticket");

const VALID_STATUSES = ["Open", "In Progress", "Resolved"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];
const VALID_SORT_FIELDS = ["createdAt", "subject", "priority"];
const VALID_SORT_ORDERS = ["asc", "desc"];
// Used to sort by priority meaningfully (High > Medium > Low)
const PRIORITY_WEIGHT = { High: 3, Medium: 2, Low: 1 };

// Escapes regex special characters so user search input is matched literally
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.getTickets = async (req, res) => {
  try {
    const { search, status, priority, sortBy = "createdAt", sortOrder = "desc" } = req.query;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
    }
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}` });
    }
    if (!VALID_SORT_FIELDS.includes(sortBy)) {
      return res.status(400).json({ message: `Invalid sortBy. Must be one of: ${VALID_SORT_FIELDS.join(", ")}` });
    }
    if (!VALID_SORT_ORDERS.includes(sortOrder)) {
      return res.status(400).json({ message: "Invalid sortOrder. Must be 'asc' or 'desc'" });
    }

    // Build the MongoDB filter from query params
    const filter = {};
    if (search && search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");
      filter.$or = [{ subject: regex }, { description: regex }];
    }
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const order = sortOrder === "asc" ? 1 : -1;

    let tickets;
    if (sortBy === "priority") {
      // Priority is a string enum, so sort by a computed numeric weight
      tickets = await Ticket.aggregate([
        { $match: filter },
        {
          $addFields: {
            priorityWeight: {
              $switch: {
                branches: Object.entries(PRIORITY_WEIGHT).map(([key, value]) => ({
                  case: { $eq: ["$priority", key] },
                  then: value,
                })),
                default: 0,
              },
            },
          },
        },
        { $sort: { priorityWeight: order, _id: order } },
      ]);
    } else {
      tickets = await Ticket.find(filter).sort({ [sortBy]: order });
    }

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets", error: err.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ticket", error: err.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    if (!subject || !description || !priority) {
      return res.status(400).json({ message: "Subject, description, and priority are required" });
    }
    const ticket = await Ticket.create({ subject, description, priority });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to create ticket", error: err.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete ticket", error: err.message });
  }
};
