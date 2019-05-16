const {ipcRenderer} = require('electron');

$("#addAccounting").on('submit', function (e) {
    e.preventDefault();

    // Serialize the data of the form
    const newAccounting = $("#addAccounting").serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    ipcRenderer.send('newAccounting', newAccounting);

    this.reset();
});

