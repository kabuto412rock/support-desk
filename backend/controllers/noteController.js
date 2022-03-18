const asyncHandler = require("express-async-handler");

const Note = require("../models/noteModel");
const Ticket = require("../models/ticketModel");

// @desc    Get  notes for a ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  let ticket = null;

  try {
    ticket = await Ticket.findById(req.params.ticketId);
  } catch (error) {
    throw new Error("Ticket is not real");
  }

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const notes = await Note.find({ ticket: req.params.ticketId });

  res.status(200).json(notes);
});

// @desc    Create ticket note
// @route   POST /api/tickets/:ticketId/notes
// @access  Private
const addNote = asyncHandler(async (req, res) => {
  let ticket = null;

  try {
    ticket = await Ticket.findById(req.params.ticketId);
  } catch (error) {
    throw new Error("Ticket is not real");
  }

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const note = await Note.create({
    text: req.body.text,
    isStaff: false,
    ticket: req.params.ticketId,
    user: req.user.id,
  });

  res.status(200).json(note);
});

module.exports = {
  getNotes,
  addNote,
};
