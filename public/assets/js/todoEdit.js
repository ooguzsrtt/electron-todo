const electron = require("electron");
const { ipcRenderer } = electron;

var todoId;
let saveBtn = document.querySelector("#saveBtn");

let backBtn = document.querySelector("#goBack");
backBtn.addEventListener("click", () => {
  ipcRenderer.send("event:goBack");
});

saveBtn.addEventListener("click", () => {
  let taskInput = document.querySelector("#taskInput");
  ipcRenderer.send("todoEdit:textEdited", {
    id: todoId,
    text: taskInput.value,
  });
});

ipcRenderer.on("ipcMain:todoDetails", (err, data) => {
  let taskInput = document.querySelector("#taskInput");
  taskInput.value = data.text;
  todoId = data.id;
});
