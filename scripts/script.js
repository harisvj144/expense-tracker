"use strict";

//elements
const balanceEl = document.getElementById("balance");
const moneyPlusEl = document.getElementById("income-amt");
const moneyMinusEl = document.getElementById("expense-amt");
const listEl = document.getElementById("lists");
const formEl = document.getElementById("form");
const transactionEl = document.getElementById("transaction");
const amountEl = document.getElementById("amount-input");

//btn
const button = document.getElementById("btn");

// radio btns
let incomeRadioEl = document.getElementById("income-radio");
let expenseRadioEl = document.getElementById("expense-radio");

//global variables
// getting data
let transactions = JSON.parse(localStorage.getItem("transactions"));

let income = 0;
let expense = 0;
let balance = 0;
let isEditing = false;
let editId = null;

//functions

//initial setting
function init() {
  listEl.innerHTML = null;
  isEditing = false;
  editId = null;
  button.innerText = "Add Transaction";

  //initial list loading
  transactions.forEach((transaction) => addTransactionDom(transaction));

  //calling calculated value
  updateValue();
}

// radio btn
function radio(amount) {
  if (incomeRadioEl.checked) {
    if (amount < 0) {
      return (amount = amount * -1);
    } else {
      return (amount = amount * 1);
    }
  }

  if (expenseRadioEl.checked) {
    if (amount < 0) {
      return (amount = amount * 1);
    } else {
      return (amount = amount * -1);
    }
  }
}

//calculating income & expensive
function updateValue() {
  //chaining array methods

  //map=> for storing a amount values in array
  //filter=> finding a value is < 0 or > 0
  //reduce=> to get a single value

  income = transactions
    .map((val) => val.amount)
    .filter((val) => val > 0)
    .reduce((preval, val) => preval + val, 0);

  expense = transactions
    .map((val) => val.amount)
    .filter((val) => val < 0)
    .reduce((preval, val) => preval + val, 0);

  balance = transactions
    .map((val) => val.amount)
    .reduce((preval, val) => preval + val, 0);

  //innerText
  moneyPlusEl.innerText = income === 0 ? `₹0.00` : `₹ ${income}`;
  moneyMinusEl.innerText = expense === 0 ? `₹0.00` : `₹ ${Math.abs(expense)}`;
  balanceEl.innerText = balance === 0 ? `₹0.00` : `₹ ${balance}`;
}

//delete the output
function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  //initial setting
  init();

  // update localstorage transactions
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// edit the output
function editTransaction(id) {
  isEditing = true;
  button.innerText = "Update Transaction";

  //finding the element to update
  const itemToEdit = transactions.find((transaction) => transaction.id === id);

  transactionEl.value = itemToEdit.name;
  amountEl.value = itemToEdit.amount;

  editId = itemToEdit.id;
}

//addtransaction to DOM
function addTransactionDom({ id, name, amount }) {
  //creating li element
  const liEl = document.createElement("li");

  //add classname to li element
  liEl.className = amount > 0 ? "plus" : "minus";
  //innerHTML
  liEl.innerHTML = `<span>${name}</span>
                    <span>₹ ${amount}</span>
                    <button class="update-btn btn" onclick=editTransaction(${id})><i class="fa-solid fa-pen"></i></button>
                    <button class="delete-btn btn" onclick=deleteTransaction(${id})>X</button>`;

  //appendchild
  listEl.appendChild(liEl);
}

//event listneres
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    //validation user input
    transactionEl.value.trim() === "" ||
    amountEl.value.trim() === "" ||
    Number(amountEl.value === "0")
  ) {
    alert("Please Enter a Valid Transaction Details");
  } else {
    if (isEditing) {
      transactions = transactions.map((transaction) => {
        if (transaction.id === editId) {
          return {
            id: editId,
            name: transactionEl.value,
            amount: radio(Number(amountEl.value)),
          };
        } else {
          return transaction;
        }
      });

      //initial setting called
      init();

      //localstorage updated and added to transactions
      localStorage.setItem("transactions", JSON.stringify(transactions));
    } else {
      if (!transactions) {
        transactions = [];
      }
      //create a transaction details
      const transaction = {
        id: Date.now(),
        name: transactionEl.value,
        amount: radio(Number(amountEl.value)),
      };

      //storing a value(object) to transactions Array
      transactions.push(transaction);

      // create a localstorage transactions
      localStorage.setItem("transactions", JSON.stringify(transactions));

      //add transaction to DOM
      addTransactionDom(transaction);
    }
  }

  //calling calculated value
  updateValue();

  //clear the input elements
  transactionEl.value = null;
  amountEl.value = null;
});

//initial setting
init();