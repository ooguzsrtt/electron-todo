const electron = require("electron");
const { ipcRenderer } = electron;

let addBtn = document.querySelector("#addBtn");
let exitBtn = document.querySelector("#exitBtn");

addBtn.addEventListener("click", () => {
  ipcRenderer.send("todoList:addBtn");
});

exitBtn.addEventListener("click", () => {
  ipcRenderer.send("click:exitBtn");
});

ipcRenderer.on("ipcMain:todoList", (err, data) => {
  for (let index = 0; index < data.length; index++) {
    const element = data[index];

    document.querySelector("#taskList").innerHTML +=
      `<li id="todoItem` +
      element.id +
      `" class="list-group-item d-flex justify-content-between align-items-center mb-2">
                ` +
      element.text +
      `
                <div>
                    <button class="btn btn-warning me-2"onclick="editBtnPressed(` +
      element.id +
      `)">Edit</button>
                    <button class="btn btn-danger" onclick="deleteBtnPressed(` +
      element.id +
      `)">Delete</button>
                </div>
            </li>`;
  }
});

ipcRenderer.on("ipcMain:newTodo", (err, data) => {
  document.querySelector("#taskList").innerHTML +=
    `<li id="todoItem` +
    data.id +
    `" class="list-group-item d-flex justify-content-between align-items-center mb-2">
                ` +
    data.text +
    `
                <div>
                    <button class="btn btn-warning me-2"onclick="editBtnPressed(` +
    data.id +
    `)">Edit</button>
                    <button class="btn btn-danger" onclick="deleteBtnPressed(` +
    data.id +
    `)">Delete</button>
                </div>
            </li>`;
});

ipcRenderer.on("ipcMain:refreshTodo", (err, data) => {
  document.querySelector("#todoItem" + data.id).innerHTML = "";
  document.querySelector("#todoItem" + data.id).innerHTML +=
    data.text +
    `
                <div>
                    <button class="btn btn-warning me-2"onclick="editBtnPressed(` +
    data.id +
    `)">Edit</button>
                    <button class="btn btn-danger" onclick="deleteBtnPressed(` +
    data.id +
    `)">Delete</button>
                </div>`;
});

function deleteBtnPressed(id) {
  let willDelete = document.querySelector("#todoItem" + id);
  willDelete.remove();
  ipcRenderer.send("todoList:deleteTodo", id);
}

function editBtnPressed(id) {
  ipcRenderer.send("todoList:editTodo", id);
}
