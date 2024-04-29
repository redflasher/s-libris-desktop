const { app, BrowserWindow, Menu, ipcMain } = require("electron/main");
const process = require('node:process');
const path = require('node:path')
const fs = require('fs')
const initSqlJs = require('sql.js');

const DB_PATH = './resources/LINKER.db';
const DATA_DIR_PATH = './resources/data/';
const preloadPath = path.join(__dirname, './preload.js');
console.log("preload.js", preloadPath);
let win = null

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())
if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

function getMenu() {
    //Setup menu
    const isMac = process.platform === 'darwin'

    const template = [
        // { role: 'appMenu' }
        ...(isMac
            ? [{
                label: app.name,
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideOthers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            }]
            : []),
        // { role: 'fileMenu' }
        /*{
          label: 'Меню',
          submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
          ]
        },*/
        // { role: 'viewMenu' }
        {
            label: 'Вид',
            submenu: [
                { label: 'Масштаб на 100%', role: 'resetZoom' , accelerator: process.platform === 'darwin' ? 'Cmd+0' : 'Ctrl+0',},
                { label: 'Увеличить',role: 'zoomIn' , accelerator: process.platform === 'darwin' ? 'Cmd+up' : 'Ctrl+up',},
                { label: 'Уменьшить', role: 'zoomOut' , accelerator: process.platform === 'darwin' ? 'Cmd+down' : 'Ctrl+down',},
                { type: 'separator' },
                { label: 'На весь экран', role: 'togglefullscreen', accelerator: 'F11' }
            ]
        },
        {
            label: 'Поиск',
            submenu: [
                { label: 'Каталог',
                    click: async () => {
                        /*
                        * тут просто каталог открывается в самом меню, либо на странице.
                        * Можно страницу, разделенную на несколько столбцов,
                        * наподобие как на маках.
                        * */
                        win.webContents.send("mainToRender", "goto:home");
                    }
                },
                { label: 'По названию документов',
                    accelerator: process.platform === 'darwin' ? 'Cmd+F' : 'Ctrl+F',
                    click: async () => {
                        win.webContents.send("mainToRender", "show:ByNameSearchPage");
                        /*
                        * Тут просто поле ввода текста
                        * и в выдаче:
                        * тип документа,
                        * название,
                        * год публикации.
                        *
                        * Фильтрация по типу документов.
                        * Сортировка по алфавиту, по дате, по объему текста.
                        * */
                    }
                },
                { label: 'По содержимому документов',
                  enabled: false,
                  accelerator: process.platform === 'darwin' ? 'Cmd+Shift+F' : 'Ctrl+Shift+F',
                  click: async () => {
                      win.webContents.send("mainToRender", "show:FulltextSearchPage");
                  /*
                  * тут опции:
                  * доп. ограничения по дате,
                  * по типу документа,
                  * по диапазону годов.
                  *
                  * Фильтрация по типу документов.
                  * Сортировка по алфавиту, по дате, по объему текста.
                  * */
                    // const { shell } = require('electron')
                    // await shell.openExternal('https://slibris.ru')
                  }
                },
                /*{ label: 'По календарю',
                  enabled: false,
                  click: async () => {
                  /!*
                  * Тут календарь с количеством документов за каждый год и за каждый месяц,
                  * по мере погружения в календарь.
                  *
                  * Фильтрация по типу документов.
                  * *!/
                    // const { shell } = require('electron')
                    // await shell.openExternal('https://slibris.ru')
                  }
                },*/

            ]
        },
        /*{
          label: 'Настройки',
          submenu: [
            {
              label: 'Сменить язык',
              accelerator: process.platform === 'darwin' ? 'Cmd+Tab' : 'Ctrl+Tab',
              click: async () => {
                win.webContents.send("mainToRender", "lang:toggle");
              }
            }
          ]
          /!*click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://slibris.ru')
          }*!/
        },*/
        {
            label: '?',
            role: 'help',
            submenu: [
                {
                    label: 'Сайт программы',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://slibris.ru')
                    }
                }
            ]
        }
    ];
    return template;
}

// main
ipcMain.on('show-context-menu', (event) => {
    const template = [
        {
            label: 'Menu Item 1',
            click: () => { event.sender.send('context-menu-command', 'menu-item-1') }
        },
        { type: 'separator' },
        { label: 'Menu Item 2', type: 'checkbox', checked: true }
    ]
    const menu = Menu.buildFromTemplate(template)
    menu.popup({ window: BrowserWindow.fromWebContents(event.sender) })
})

//Start program
async function dbInit() {
    console.log(__dirname);
    const filebuffer = fs.readFileSync(DB_PATH);
    console.log(filebuffer.length);
    return initSqlJs().then(function(SQL) {
        return new Promise(resolve => {
            // Load the db
            const db = new SQL.Database(filebuffer);
            console.log(db);
            resolve(db);
        });
    });
}


function loadGroupsList(_db) {
    const stmt = _db.prepare("SELECT * FROM CHECK_LIST_GROUP");
    let checkLists = [];
    while(stmt.step()) { //
        const row = stmt.getAsObject();
        checkLists.push(row);
    }
    return checkLists;
}

function loadCoursesList(_db, checkListId) {
    curGroupId = checkListId;
    const stmt = _db.prepare("SELECT * FROM CHECK_LIST WHERE ID_GROUP=$checkListId");
    stmt.bind({$checkListId:checkListId});
    let coursesList = [];
    while(stmt.step()) { //
        const row = stmt.getAsObject();
        coursesList.push(row);
    }
    return coursesList;
}

function loadCourseList(_db, courseId) {
    curCourseId = courseId;
    let sqlRaw = "SELECT m.ID as ID, m.NAME as NAME, m.DATE_MATERIALS as DATE_MATERIALS, FILE_NAME FROM MATERIALS m " +
        "LEFT JOIN CHECK_LIST_DATA cld " +
        "ON cld.ID_MATERIALS=m.ID " +
        "WHERE cld.ID_PARENT=" + courseId +
        " ORDER BY cld.SECTION ASC";


    const stmt = _db.prepare(sqlRaw);
    let documentsList = [];
    while(stmt.step()) { //
        const row = stmt.getAsObject();
        documentsList.push(row);
        console.log('loadCourseList row: ' + JSON.stringify(row));
    }
    return documentsList;
}

/**
 * @deprecated
 * */
async function loadDocxFile(filename) {
    //обработка строки с путем до файла
    console.log("loadDocxFile.filename", filename)

    let filenameArr = filename.split("\\");
    filename = filenameArr[filenameArr.length-1];
    filename = filename.split(".doc")[0] + ".docx";
    let pathToDocxFile = path.join(DATA_DIR_PATH, filename);
    console.log("pathToDocxFile", __dirname, __filename, pathToDocxFile)
    const file = fs.readFileSync(pathToDocxFile);
    return file.buffer;
}

async function loadDocxFileByFilename(filename) {
    //обработка строки с путем до файла
    let filenameArr = filename.split("\\");
    filename = filenameArr[filenameArr.length-1];
    filename = filename.split(".doc")[0] + ".docx";
    let pathToDocxFile = path.join(DATA_DIR_PATH, filename);
    console.log("pathToDocxFile", pathToDocxFile);
    const file = fs.readFileSync(pathToDocxFile);
    return file.buffer;
}

async function loadDocxFileById(_db, id) {
    let filename = "";
    let sqlRaw = "SELECT NAME, FILE_NAME FROM MATERIALS m " +
        "WHERE ID=" + id +
        " LIMIT 1";
    const stmt = _db.prepare(sqlRaw);
    let documentsList = [];
    while(stmt.step()) { //
        const row = stmt.getAsObject();
        documentsList.push(row);
        filename = row.FILE_NAME;
    }
    let filenameArr = filename.split("\\");
    filename = filenameArr[filenameArr.length-1];
    filename = filename.split(".doc")[0] + ".docx";
    let pathToDocxFile = path.join(DATA_DIR_PATH, filename);
    console.log("pathToDocxFile", pathToDocxFile);
    const file = fs.readFileSync(pathToDocxFile);
    console.log("file.buffer.length", file.buffer.length);
    return file.buffer;
}

async function getGroupName(_db, groupId) {
    curGroupId = groupId;
    let sqlRaw = "SELECT NAME FROM CHECK_LIST_GROUP " +
        "WHERE ID=" + groupId +
        " LIMIT 1";
    const stmt = _db.prepare(sqlRaw);
    let groupName = [];
    while(stmt.step()) { //
        const row = stmt.getAsObject();
        groupName.push(row);
    }
    return groupName.length > 0 ? groupName[0].NAME : '';
}

async function getCourseName(_db, courseId) {
    curCourseId = courseId;
    let sqlRaw = "SELECT NAME FROM CHECK_LIST " +
        "WHERE ID=" + courseId +
        " LIMIT 1";
    const stmt = _db.prepare(sqlRaw);
    let groupName = [];
    while(stmt.step()) { //
        const row = stmt.getAsObject();
        groupName.push(row);
    }
    return groupName.length > 0 ? groupName[0].NAME : '';
}

async function getDocumentName(_db, documentId) {
    curDocumentId = documentId;
    let sqlRaw = "SELECT NAME FROM MATERIALS " +
        "WHERE ID=" + documentId +
        " LIMIT 1";
    const stmt = _db.prepare(sqlRaw);
    let documentName = [];
    while(stmt.step()) { //
        const row = stmt.getAsObject();
        documentName.push(row);
    }
    return documentName.length > 0 ? documentName[0].NAME : '';
}

async function searchDocsByName(_db, searchText, isFromStartOnly, isSortByName) {
    let stmt;
    let sortSqlText;

    if (isSortByName) {
        sortSqlText = "ORDER BY NAME COLLATE NOCASE, LENGTH(NAME) ";
    } else {
        sortSqlText = "ORDER BY DATE_MATERIALS ASC ";
    }
    //info: можно добавить в меню "инструменты" и там "словарь", "админ словарь" и пр.
    if(isFromStartOnly) {
        stmt = _db.prepare("SELECT ID, NAME, DATE_MATERIALS, FILE_NAME FROM MATERIALS " +
            "WHERE NAME LIKE '" + searchText.toUpperCase() + "%' " +
            sortSqlText +
            "LIMIT 1000");
    } else {
        stmt = _db.prepare("SELECT ID, NAME, DATE_MATERIALS, FILE_NAME FROM MATERIALS " +
            "WHERE NAME LIKE '%" + searchText.toUpperCase() + "%' " +
            sortSqlText +
            "LIMIT 1000");
    }
    let checkLists = [];
    while(stmt.step()) { //
        const row = stmt.getAsObject();
        checkLists.push(row);
    }
    return checkLists;
}


function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    if(process.argv.length > 1 && process.argv[1] === "--dev") {
        console.log("dev mode");
        win.webContents.openDevTools()
    }

    win.loadFile("./dist/index.html");
    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
    // win.webContents.on('will-navigate', (event, url) => { }) #344

    //menu
    const menu = Menu.buildFromTemplate(getMenu());
    Menu.setApplicationMenu(menu);
}

app.on('ready',() => {
    dbInit()
        .then(_db => {
            console.log("db inited", _db);

            ipcMain.handle('loadGroupsList', async (event) => {
                return loadGroupsList(_db);
            });

            ipcMain.handle('loadCoursesList', async (event, checkListId) => {
                return loadCoursesList(_db, checkListId);
            });

            ipcMain.handle('loadCourseList', async (event, checkListId) => {
                return loadCourseList(_db, checkListId);
            });

            ipcMain.handle('loadDocxFileByFilename', async (event, filename) => {
                return loadDocxFileByFilename(filename);
            });

            ipcMain.handle('loadDocxFileById', async (event, id) => {
                return loadDocxFileById(_db, id);
            });

            ipcMain.handle('getGroupName', async (event, groupId) => {
                return getGroupName(_db, groupId);
            });

            ipcMain.handle('getCourseName', async (event, courseId) => {
                return getCourseName(_db, courseId);
            });

            ipcMain.handle('getDocumentName', async (event, docId) => {
                return getDocumentName(_db, docId);
            });

            ipcMain.handle('searchDocsByName', async (event,
                                                      searchText,
                                                      _isFromStartOnly,
                                                      isSortByName) => {
                return searchDocsByName(_db, searchText,_isFromStartOnly, isSortByName);
            });


            createWindow()
        })

    /*app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });*/
});

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
