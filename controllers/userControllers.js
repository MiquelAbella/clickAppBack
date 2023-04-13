const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const createUser = async (req, res) => {
  const { user } = req.body;
  const { email, fullName, password, repPassword } = user;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "User already exists",
      });
    }

    if (password !== repPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Passwords do not match",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    console.log(salt);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      userId: uuidv4(),
    });

    await newUser.save();
    const { userId, _id } = newUser;
    return res
      .status(201)
      .json({ ok: true, user: { email, fullName, userId, _id } });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

const loginUser = async (req, res) => {
  const { user } = req.body;
  const { email, password } = user;

  try {
    const userFromDb = await User.findOne({ email: email }).populate("todos");
    if (!userFromDb) {
      return res.status(400).json({
        ok: false,
        msg: "Passwords and email do not match",
      });
    }
    const passwordFromDb = userFromDb.password;
    const isValidPassword = await bcrypt.compare(password, passwordFromDb);

    if (!isValidPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Passwords and email do not match",
      });
    }

    const { email: userEmail, userId, fullName, _id } = userFromDb;

    return res.status(200).json({
      ok: true,
      user: { userEmail, userId, fullName, _id, todos: userFromDb.todos },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

module.exports = { createUser, loginUser };
