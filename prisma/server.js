const express = require("express");
const app = express();
const PORT = 3000;

const prisma = require("./prisma")

app.use(express.json());
app.use(require("morgan")("dev"));