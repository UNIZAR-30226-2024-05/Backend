const express = require("express");
const https = require('https');
const fs = require('fs');

const cors = require('cors');
const sessions = require('client-sessions');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use(sessions({
  cookieName: 'session',
  secret: 'secret'
}));

const httpsOptions = {
  cert: fs.readFileSync('/etc/letsencrypt/live/server.narratives.es/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/server.narratives.es/privkey.pem')
};

const server = https.createServer(httpsOptions, app);

const io = require("socket.io")(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

module.exports = io;

const homeRoutes = require("./routes/homeRoutes");
const userRoutes = require("./routes/userRoutes");
const audiolibrosRoutes = require("./routes/audiolibrosRoutes");
const coleccionesRoutes = require("./routes/coleccionesRoutes");
const amistadRoutes = require("./routes/amistadRoutes");
const marcapaginasRoutes = require("./routes/marcapaginasRoutes");
const autoresRoutes = require("./routes/autoresRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const clubRoutes = require("./routes/clubRoutes");

const PORT = process.env.PORT || 8000;

app.use("/home", homeRoutes)
app.use("/users", userRoutes);
app.use("/audiolibros", audiolibrosRoutes);
app.use("/colecciones", coleccionesRoutes);
app.use("/amistad", amistadRoutes);
app.use("/marcapaginas", marcapaginasRoutes);
app.use("/autores", autoresRoutes);
app.use("/review", reviewRoutes);
app.use("/club", clubRoutes);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
