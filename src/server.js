const express = require("express");
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
  secret: 'secret',
  cookie: {
    sameSite: 'none',
    secure: true
  }
}));

const userRoutes = require("./routes/userRoutes");
const audiolibrosRoutes = require("./routes/audiolibrosRoutes");

const PORT = process.env.PORT || 8000;

app.use("/users", userRoutes);
app.use("/audiolibros", audiolibrosRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
