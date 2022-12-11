import { loadDataFromJSON, findUser, addUser } from "../src/utils.js";

export const getAllUsers = (req, res) => {
  try {
    const users = loadDataFromJSON();
    return res.status(200).send(users);
  } catch (error) {
    res.status(400).send("Error", error.code);
  }
};

export const getUserByID = (req, res) => {
  const { id } = req.params;
  const user = findUser(id);

  if (!user) {
    return res.status(400).send("No user with the specified id");
  } else {
    res.status(200).send(user);
  }
};

export const createUser = (req, res) => {
  try {
    const { id, cash, credit, name } = req.body;
    const user = addUser(id, cash, credit, name);
    if (!name) {
      return res.status(400).send("Must provide name!");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("User already exist");
  }
};
