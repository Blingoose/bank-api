import {
  findUser,
  withdraw,
  deposit,
  updatecredit,
  transfer,
} from "../src/utils.js";

export const actions = (req, res) => {
  try {
    const action = req.query.action;
    const id = req.query.id;
    const data = req.body;
    const user = findUser(id);
    if (!user) {
      return res
        .status(400)
        .send("Error: No users found the with specified id ");
    }
    switch (action) {
      case "withdraw":
        withdraw(id, data.amount);
        res
          .status(200)
          .send(
            `User with id ${id} has withdrew ${data.amount}\nCurrent balance: ${
              user.cash + user.credit - data.amount
            }`
          );
        break;

      case "deposit":
        deposit(id, data.amount);
        res
          .status(200)
          .send(
            `User with id ${id} has deposited ${
              data.amount
            }\nCurrent balance: ${user.cash + user.credit - data.amount}`
          );
        break;

      case "updatecredit":
        updatecredit(id, data.amount);
        res
          .status(200)
          .send(`New credit of ${data.amount} updated for User with id ${id}`);
        break;

      case "transfer":
        transfer(id, data);
        res
          .status(200)
          .send(
            `User with id ${id} has successfully transferred ${data.amount} to user with id ${data.id} `
          );
        break;

      default:
        res
          .status(400)
          .send(
            "Action failed. Allowed actions are:\ntransfer, widthdraw, deposit, update-credit"
          );
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
