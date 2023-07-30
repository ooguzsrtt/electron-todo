const electron = require("electron");
const { ipcRenderer } = electron;

let addBtn = document.querySelector("#addBtn");
let backBtn = document.querySelector("#goBack");
let taskInput = document.querySelector("#taskInput");

addBtn.addEventListener("click", () => {
  ipcRenderer.send("todoAdd:newTodo", taskInput.value);
});

backBtn.addEventListener("click", () => {
  ipcRenderer.send("event:goBack");
});
