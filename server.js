const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const qbRoutes = require("./routes/main");

const app = express();

app.use(bodyParser.json());

app.use(mainRoutes);

app.listen(3000);
