const express = require('express');
const http = require('http');

const cors = require('cors');
const sessions = require('client-sessions');

const app = express();

//Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use(sessions({
  cookieName: 'session',
  secret: 'secret'
}));

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

module.exports = io;

const userRoutes = require("./routes/userRoutes");
const audiolibrosRoutes = require("./routes/audiolibrosRoutes");

const PORT = process.env.PORT || 8000;

app.use("/users", userRoutes);
app.use("/audiolibros", audiolibrosRoutes);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
