const express = require("express");
const router = express.Router();
const { getTickets, createTicket, getTicketById, deleteTicket } = require("../controllers/ticketController");

router.get("/", getTickets);
router.get("/:id", getTicketById);
router.post("/", createTicket);
router.delete("/:id", deleteTicket);

module.exports = router;
