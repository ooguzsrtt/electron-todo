const electron = require("electron");

const { app, BrowserWindow, ipcMain, Menu, screen } = electron;

const url = require("url");
const path = require("path");
const { subscribe } = require("diagnostics_channel");

let mainWindow;
let addWindow;
let editWindow;
let todoData = [
  {
    id: 0,
    text: "Todo #1",
  },
  {
    id: 1,
    text: "Todo #2",
  },
];

app.on("ready", () => {
  mainWindowSizes = createWindowSizes(
    { screenX: 1920, screenY: 1040 },
    { aspectX: 720, aspectY: 720 },
    screen
  );
  mainWindow = createWindow(
    mainWindowSizes.x,
    mainWindowSizes.y,
    "todoList.html"
  );

  ipcMain.on("todoList:addBtn", () => {
    addWindowSizes = createWindowSizes(
      { screenX: 1920, screenY: 1040 },
      { aspectX: 500, aspectY: 265 },
      screen
    );
    addWindow = createWindow(
      addWindowSizes.x,
      addWindowSizes.y,
      "todoAdd.html"
    );
  });

  ipcMain.on("todoList:editTodo", (err, id) => {
    editWindowSizes = createWindowSizes(
      { screenX: 1920, screenY: 1040 },
      { aspectX: 500, aspectY: 265 },
      screen
    );
    editWindow = createWindow(
      editWindowSizes.x,
      editWindowSizes.y,
      "todoEdit.html"
    );
    editWindow.webContents.on("did-finish-load", () => {
      editWindow.webContents.send(
        "ipcMain:todoDetails",
        todoData.find((el) => el.id === id)
      );
    });
  });

  ipcMain.on("todoEdit:textEdited", (err, todo) => {
    let effectedTodo = todoData.find((el) => el.id == todo.id);
    effectedTodo.text = todo.text;
    editWindow.close();
    editWindow = null;
    mainWindow.webContents.send("ipcMain:refreshTodo", effectedTodo);
  });

  ipcMain.on("todoAdd:newTodo", (err, todoText) => {
    var idLookup = Math.max(...todoData.map((el) => el.id));
    let newTodo = {
      id: idLookup >= 0 ? idLookup + 1 : 0,
      text: todoText,
    };
    todoData.push(newTodo);
    mainWindow.webContents.send("ipcMain:newTodo", newTodo);
    addWindow.close();
    addWindow = null;
  });

  ipcMain.on("todoList:deleteTodo", (err, id) => {
    todoData.splice(
      todoData.findIndex((el) => el.id === id),
      1
    );
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("ipcMain:todoList", todoData);
  });

  ipcMain.on("event:goBack", () => {
    if (addWindow != null) {
      addWindow.close();
      addWindow = null;
    } else if (editWindow != null) {
      editWindow.close();
      editWindow = null;
    }
  });

  ipcMain.on("click:exitBtn", () => {
    if (addWindow != null) {
      addWindow.close();
      addWindow = null;
    } else if (editWindow != null) {
      editWindow.close();
      editWindow = null;
    } else if (mainWindow != null) {
      mainWindow.close();
      mainWindow = null;
    }
  });
});

/*let mainMenuTemplate = [
   {
    label: "Uygulama",
    submenu: [
      {
        label: "Çıkış Yap",
        accelerator: "Ctrl+Q",
        role: "quit",
      },
    ],
  },
  {
    label: "Dev Tools",
    submenu: [
      {
        label: "Geliştirici Konsolu",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
        accelerator: "Ctrl+Alt+D",
      },
      {
        label: "Yenile",
        role: "reload",
        accelerator: "F5",
      },
    ],
  }, 
];*/

function createWindow(w, h, file) {
  var window = new BrowserWindow({
    width: w,
    height: h,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    frame: false,
    resizable: false,
  });

  window.webContents.on("before-input-event", (event, input) => {
    if (input.code == "F4" && input.alt) event.preventDefault();
  });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/" + file),
      protocol: "file:",
      slashes: true,
    })
  );
  window.on("close", () => {
    window = null;
  });
  return window;
}

function createWindowSizes({ screenX, screenY }, { aspectX, aspectY }, screen) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  substance = screenY - height;
  //sign = Math.sign(substance);
  heightIncrease = Math.round((44 * substance) / 100);

  percentX = Math.round((aspectX * 100) / screenX);
  percentY = Math.round((aspectY * 100) / screenY);

  return {
    x: Math.round((width * percentX) / 100),
    y: aspectY + heightIncrease,
  };
}
