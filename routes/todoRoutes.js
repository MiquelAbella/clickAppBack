const express = require("express");
const { createTodo } = require("../controllers/todoControllers");

const router = express.Router();

router.post("/", createTodo);

module.exports = router;
