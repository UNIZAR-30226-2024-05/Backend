const express = require("express");
const cors = require('cors');
const session = require('express-session');
const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

const userRoutes = require("./routes/userRoutes");

const PORT = process.env.PORT || 8000;

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
