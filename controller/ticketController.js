const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Admin = require("../models/Admin");

const addTicket = async (req, res) => {
  const { name, amount, image, status } = req.body;
  try {
    const newTicket = new Ticket({
      name,
      amount,
      image,
      status,
      user: req.params.id,
    });
    //   console.log(newTicket, "okay");
    await newTicket.save();
    res.status(200).send({
      message: "Ticket Added successfully",
      status: 200,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      status: 500,
    });
  }
  //   console.log(req.body, "hello");
};

const deleteTicket = async (req, res) => {
  //   const { wallet } = req.body;
  Ticket.deleteOne({ _id: req.params.id }, (error) => {
    if (error) {
      res.status(500).send({
        message: error.message,
        status: 500,
      });
    } else {
      res.status(200).send({
        message: "Ticket Deleted Successfully",
        status: 200,
      });
    }
  });
};

const getTicket = async (req, res) => {
  try {
    const tickets = await Ticket.find({}).sort({ _id: -1 });
    res.send(tickets);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ _id: req.params.id });
    if (ticket.status === false) {
      await Ticket.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: true,
          },
        }
      );
      const ticketAmount = await Ticket.findById(req.params.id);
      await User.updateOne(
        { _id: ticketAmount.user },
        {
          $inc: { wallet: ticketAmount.amount },
        }
      );

      await Admin.updateOne(
        { role: "admin" },
        {
          $inc: { wallet: ticketAmount.amount },
        }
      );
      res.status(200).send({
        message: "Wallet Update successfully",
        status: 200,
      });

      
    } else {
      res.status(400).send({
        message: "This Ticket is already used.",
        status: 400,
      });
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
};

module.exports = {
  addTicket,
  deleteTicket,
  getTicket,
  updateTicketStatus,
};
