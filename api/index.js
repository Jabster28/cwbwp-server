const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(express.static("public"));
const serverCodes = {};
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
io.on("connection", socket => {
  status = null;
  let server = null;
  let clients = [];
  console.log("oop someone's here, let's see what they choose ");
  socket.on("server", () => {
    console.log(
      "it's a server gamers, let's fucking goooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"
    );
    status = "server";
    let code = Math.floor(Math.random() * 10000);

    socket.emit("code", code);
    serverCodes[code] = socket.id;
  });
  socket.on("client", () => {
    console.log("eww it's a client");
    status = "client";
  });
  socket.on("choose", code => {
    console.log(`cringe, the client wants to connect to ` + code);
    io.emit("connectRequest", {
      code: code,
      client: socket.id
    });
  });
  socket.on("chat", e => {
    io.emit("chat", e);
  });
  socket.on("connectCon", e => {
    io.emit("connectCon", e);
  });
  socket.on("disconnect", () => {
    switch (status) {
      case "client":
        console.log("oh thank god a client disconnected");
        io.emit("clientdc", socket.id);
        break;
      case "server":
        console.log("noooo, server died :pensive:");
        io.emit("serverdc", socket.id);
        break;
      default:
        console.log("fucker dc'd without a hello, can't have shit in detroit");
    }
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
