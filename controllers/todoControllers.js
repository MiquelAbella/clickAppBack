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

    if (user.todos) {
      user.todos = [...user.todos, newTodo._id];
    } else {
      user.todos = [newTodo._id];
    }

    await user.save();
    await newTodo.save();

    return res.status(201).json({
      ok: true,
      user,
      newTodo,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

module.exports = { createTodo };
