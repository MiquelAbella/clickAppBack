const express = require("express");
const { createTodo, deleteTodo } = require("../controllers/todoControllers");

const router = express.Router();

router.post("/", createTodo);
router.post("/delete", deleteTodo);

module.exports = router;
