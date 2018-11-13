const express = require("express");
const chalk = require("chalk");

const app = express();

const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const PORT = process.env.PORT || 3000; // default port to 3000

/* eslint-disable no-console */
http.listen(PORT, () =>
  console.log(
    // sets server to listen to PORT and outputs to the CL
    chalk.green.bold("Server listening on port: ") + chalk.cyan.bold(PORT)
  )
);
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });
app.use(express.static(path.join(__dirname, "public")));

let numUsers = 0;

io.on("connection", socket => {
  var addedUser = false;
  console.log("new user connected");

  // when the client emits 'new message', this listens and executes
  socket.on("new message", data => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit("new message", {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on("add user", username => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit("login", {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit("user joined", {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on("typing", () => {
    socket.broadcast.emit("typing", {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing", {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on("disconnect", () => {
    if (addedUser) {
      --numUsers;
      console.log(socket.username, " disconnected");

      // echo globally that this client has left
      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
