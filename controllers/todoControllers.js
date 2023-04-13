const Todo = require("../models/Todo");
const User = require("../models/User");

const createTodo = async (req, res) => {
  const { todo, userId } = req.body;

  if (!todo || !userId) {
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }

  try {
    const newTodo = new Todo({
      text: todo,
      status: "pending",
      owner: userId,
    });

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(503).json({
        ok: false,
        msg: "Something happened",
      });
    }

    user.todos = [...user.todos, newTodo];

    await user.save();

    return res.status(201).json({
      ok: true,
      user,
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

const deleteTodo = async (req, res) => {
  const { todoId, userId } = req.body;

  if (!todoId || !userId) {
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(503).json({
        ok: false,
        msg: "Something happened",
      });
    }

    const filteredTodos = user.todos.filter((todo) => {
      return todo._id.toString() !== todoId;
    });

    user.todos = filteredTodos;

    await user.save();

    res.status(200).json({
      ok: true,
      user: user,
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

module.exports = { createTodo, deleteTodo };
