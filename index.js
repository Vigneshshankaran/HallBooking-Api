require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

//room
const rooms = [
  {
    name: "Elite",
    seats: 130,
    amenities: "Front desk,Luggage storage, Travel desk, Parking facitity",
    price: 1500,
    roomId: "12345",
    bookingDetails: [
      {
        customerName: "Vinoth",
        date: new Date("2021-11-14"),
        start: "07:00",
        end: "10:00",
        status: "confirmed",
      },
    ],
  },
  {
    name: "Premium",
    seats: 180,
    amenities: "Front desk,Luggage storage, Travel desk, Parking facitity,wifi,projection screen,AC,TV,",
    price: 3500,
    roomId: "23456",
    bookingDetails: [
      {
        customerName: "Vignesh",
        date: new Date("2021-11-14"),
        start: "15:00",
        end: "17:00",
        status: "Payment Pending",
      },
    ],
  },
];
//common call api status
app.get("/", (req, res) => {
  res.status(200).send("Server is running successfully ");
});

//create room
app.post("/createRoom", (req, res) => {
  rooms.push({
    name: req.body.name,
    seats: req.body.seats,
    amenities: req.body.amenities,
    price: req.body.price,
    roomId: "ghi",
    bookingDetails: [{}],
  });
  res.status(200).send("Room Created");
});

//Book rooms
app.post("/bookRoom", (req, res, next) => {
  for (let i = 0; i < rooms.length; i++) {
    console.log("a");
    if (!(rooms[i].roomId === req.body.roomId)) {
      return res.status(400).send({ error: "Invalid" });
    } else {
      let booking = {
        customerName: req.body.name,
        date: new Date(req.body.date),
        start: req.body.start,
        end: req.body.end,
        status: "confirmed",
      };
      let result = undefined;
      rooms[i].bookingDetails.forEach((book) => {
        if (
          book.date.getTime() == booking.date.getTime() &&
          book.start === booking.start
        ) {
          result = 0;
          console.log("in booking");
          
        } else {
          result = 1;
          rooms[i].bookingDetails.push(booking);
          // return res.status(200).send("Booking confirmed")
        }
      });
      if (result) return res.status(200).send("Booking confirmed");
      else
        return res
          .status(400)
          .send({ error: "Please select different time slot" });
    }
  }
});

//list customers

app.get("/listCustomer", (req, res) => {
  let customerArray = [];

  rooms.forEach((room) => {
    let customerObj = { roomName: room.name };

    room.bookingDetails.forEach((customer) => {
      customerObj.customerName = customer.customerName;
      customerObj.date = customer.date;
      customerObj.start = customer.start;
      customerObj.end = customer.end;

      customerArray.push(customerObj);
    });
  });

  res.send(customerArray);
});

//get rooms

app.get("/listRooms", (req, res) => {
  console.log("list rooms");
  res.status(200).send(rooms);
});

app.get("/", (req, res) => {
  console.log("server is running successfully");
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`server started at ${port}`);
});