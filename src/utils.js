import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const jsonDirPath = path.join(__dirname, "../db");
const jsonFile = `${jsonDirPath}/data.json`;

export const loadDataFromJSON = () => {
  try {
    const dataJSON = fs.readFileSync(jsonFile, "utf-8");
    return JSON.parse(dataJSON);
  } catch (error) {
    console.log("Cannot load the file!\nERROR CODE:", error.code);
  }
};

export const saveDataToJSON = (data) => {
  try {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync(jsonFile, stringifyData);
  } catch (error) {
    return [];
  }
};

export const findUser = (id) => {
  const users = loadDataFromJSON();
  return users.find((user) => user.id === +id || user.id === id.toString());
};

export const findIndexOfUser = (id) => {
  const users = loadDataFromJSON();
  return users.findIndex(
    (user) => user.id === +id || user.id === id.toString()
  );
};

export const addUser = (id = uuidv4(), cash = 0, credit = 0, name) => {
  const users = loadDataFromJSON();
  if (findUser(id)) {
    throw new Error();
  } else {
    const user = { id, cash, credit, name };
    users.push(user);
    saveDataToJSON(users);
    return user;
  }
};

const isNumeric = (num) => {
  if (
    (typeof num === "number" ||
      (typeof num === "string" && num.trim() !== "")) &&
    !isNaN(num) &&
    +num === parseInt(num) &&
    num.toString().indexOf("e") < 0 &&
    Number.isInteger(+num) &&
    !num.toString().startsWith("0x")
  ) {
    return true;
  }
  return false;
};

const transferValidator = (data) => {
  const arr = Object.keys(data);
  const validKeyNames = ["amount", "id"];
  if (
    arr.every((e) => validKeyNames.includes(e)) &&
    arr.length === validKeyNames.length
  ) {
    return true;
  } else {
    return false;
  }
};

export const withdraw = (id, amount) => {
  if (!isNumeric(amount) || +amount <= 0) {
    throw new Error("Invalid amount");
  } else {
    const data = loadDataFromJSON();
    const user = findUser(id);
    const moneyBalance = Number(user.cash) + Number(user.credit);
    if (amount > moneyBalance) {
      throw new Error("Insufficient funds, Your Balance is " + moneyBalance);
    } else {
      const index = findIndexOfUser(id);
      let userCash = data[index].cash;
      userCash = Number(userCash) - Number(amount);
      data[index].cash = userCash;
      saveDataToJSON(data);
    }
  }
};

export const deposit = (id, amount) => {
  if (!isNumeric(amount) || +amount <= 0) {
    throw new Error("Invalid amount");
  } else {
    const data = loadDataFromJSON();
    const index = findIndexOfUser(id);
    let userCash = data[index].cash;
    userCash = Number(userCash) + Number(amount);
    data[index].cash = userCash;
    saveDataToJSON(data);
  }
};

export const updatecredit = (id, amount) => {
  const action = "updatecredit";
  if (!isNumeric(amount, action) || +amount < 0) {
    throw new Error("Invalid amount");
  } else {
    const data = loadDataFromJSON();
    const index = findIndexOfUser(id);
    let userCredit = data[index].credit;
    userCredit = Number(amount);
    data[index].credit = userCredit;
    saveDataToJSON(data);
  }
};

export const transfer = (fromID, body) => {
  try {
    if (transferValidator(body)) {
      if (fromID.toString() === body.id.toString()) {
        throw new Error(
          "Error: sender id cannot be a receiver id at the same time"
        );
      }
      if (!isNumeric(body.amount) || +body.amount <= 0) {
        throw new Error("Invalid amount");
      } else {
        const data = loadDataFromJSON();
        const findReceiver = findUser(body.id);
        if (!findReceiver) {
          throw new Error("Invalid receiver id");
        }
        const senderIndex = findIndexOfUser(fromID);
        const receiverIndex = findIndexOfUser(body.id);
        const sender = findUser(fromID);
        const moneyBalance = Number(sender.cash) + Number(sender.credit);
        if (body.amount > moneyBalance) {
          throw new Error(
            "Insufficient funds, Your Balance is " + moneyBalance
          );
        } else {
          let senderCash = data[senderIndex].cash;
          let receiverCash = data[receiverIndex].cash;
          senderCash = Number(senderCash) - Number(body.amount);
          receiverCash = Number(receiverCash) + Number(body.amount);
          data[senderIndex].cash = senderCash;
          data[receiverIndex].cash = receiverCash;
          saveDataToJSON(data);
        }
      }
    } else
      throw new Error(
        "Error: must provide receiver [id] and [amount] properties."
      );
  } catch (error) {
    throw new Error(error);
  }
};
