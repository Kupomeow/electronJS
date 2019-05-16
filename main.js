const path = require('path');
const {app, BrowserWindow, ipcMain, Menu, Notification} = require('electron');
const Store = require('electron-store');
const fs = require('fs');

// Create some data, for the moment they are not persisted
let accountingArray = [];
let depenseArray = [];
let recetteArray = [];
let winMain = null;
let winAddAccounting = null;

const store = new Store();
// use for calcul balance whit .reduce
const reducer = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue.value);


app.on('ready', function createWindow() {
    winMain = new BrowserWindow({width: 800, height: 600});

    winMain.loadFile(path.join('src', 'index.html'));

    // Listen when the window is finished to load
    winMain.webContents.once('did-finish-load', function () {

        if (store.has('accounting')) {
            accountingArray = store.get('accounting');
        }

        // Send the accountingArray with the showAccounting event
        winMain.webContents.send('showAccounting', accountingArray);

    });
});

// listen when showNewAccountingWindow and create new window winAddAccounting
ipcMain.on('showNewAccountingWindow', function (e, arg) {

    winAddAccounting = new BrowserWindow({width: 800, height: 600});

    winAddAccounting.loadFile(path.join('src', 'addAccounting.html'));

    //console.log(accountingArray.reduce(reducer, 0));


});


ipcMain.on('newAccounting', function (e, newAccounting) {
    // Set the id of the Accounting
    let newId = 1;
    if (accountingArray.length > 0) {
        newId = accountingArray[accountingArray.length - 1].id + 1;
    }

    newAccounting.id = newId;

    // Add the new accounting to the array
    accountingArray.push(newAccounting);

    // Update the file with the new array of accountingArray
    store.set('accounting', accountingArray);

    // Reuse the showAccounting event for update the view
    winMain.webContents.send('showAccounting', [newAccounting]);
});

ipcMain.on('deleteAccounting', function (e, accountingId) {

    // Delete the accounting from the array
    for (let i = 0; i < accountingArray.length; i++) {
        if (accountingArray[i].id === accountingId) {
            accountingArray.splice(i, 1);
            break;
        }
    }

    // Update the file with the new array of accounting in store
    store.set('accounting', accountingArray);

    // Send back a confirmation that the accounting is correctly deleted
    e.sender.send('deleted', accountingId);
});


// CSV export library
const template = [
    {
        label: 'Exporter',
        submenu: [
            {
                label: 'exporter total (recette/dépense)',
                accelerator: 'Control+F1',
                click() {
                    const ObjectsToCsv = require('objects-to-csv');
                    // Save to file:
                    let csv = new ObjectsToCsv(accountingArray);
                    csv.toDisk('./livre des dépenses et recettes.csv', {append: true});
                }


            },
            {
                label: 'exporter les dépenses',
                accelerator: 'Control+F2',
                click() {
                    depenseArray = [];
                    recetteArray = [];
                    checkArrayAndPush();
                    const ObjectsToCsv = require('objects-to-csv');
                    // Save to file:
                     let csv = new ObjectsToCsv(depenseArray);
                    csv.toDisk('./livre des dépenses.csv', {append: true});
                }


            },
            {
                label: 'exporter les recettes',
                accelerator: 'Control+F3',
                click() {
                    depenseArray = [];
                    recetteArray = [];
                    checkArrayAndPush();
                    const ObjectsToCsv = require('objects-to-csv');
                    // Save to file:
                    let csv = new ObjectsToCsv(recetteArray);
                    console.log(recetteArray);
                     csv.toDisk('./livre des recettes.csv', {append: true});
                }
            }
        ]
    },
    {
        label: 'devtool',
        submenu: [
            {role: 'toggledevtools'}
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

function checkArrayAndPush() {

    for (let i = 0; i < accountingArray.length; i++) {
        if (accountingArray[i].value[0] === "-") {
            depenseArray.push(accountingArray[i]);
        } else {
            recetteArray.push(accountingArray[i]);
        }
    }

}