const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;
const reducer = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue.value);
// Function for generate a row in the table

//FOR ACCOUNTING

function generateRowTable(accounting) {
    // Retrieve the body of the table with an ID
    const tbody = $('#accounting');

    // Create the complete row into table
    const tr = $('<tr id="rowAccounting_' + accounting.id + '">');
    tr.append('<td>' + accounting.date + '</td>');
    tr.append('<td>' + accounting.title + '</td>');
    tr.append('<td>' + accounting.value + '</td>');
    tr.append('<td>' + '<button type="button" id="deleteButton_' + accounting.id + '" class="btn btn-danger">Delete </button></td>');

    // Append it to the table
    tbody.append(tr);

    // Create listener for delete button
    $('#deleteButton_' + accounting.id).on('click', function (e) {
        e.preventDefault();
        dialog.showMessageBox(
            {
                type: 'warning',
                buttons: ['No', 'yes'],
                message: 'Etes vous sûr de vouloir supprimer cette recette/dépense ?',
            }, function (res) {
                if (res === 1) {
                    ipcRenderer.send('deleteAccounting', accounting.id);
                }
            }
        );
    });
}

function generateBalanceDiv(res) {
    // Retrieve div on html whith id
    const div = $('#balance');
    div.text("Bilan financier :  " + res);


}

// Listen for addButton on click event
const addButton = $('#addButton');
addButton.on('click', function (e) {
    e.preventDefault();

    ipcRenderer.send('showNewAccountingWindow');

});

// Listen for the showAccounting event
ipcRenderer.on('showAccounting', function (e, accountingArray) {
    console.log(accountingArray.reduce(reducer , 0));
    let res = accountingArray.reduce(reducer , 0);

    generateBalanceDiv(res);
    // Loop through each car in the array send
    accountingArray.forEach(generateRowTable);
});

// Listen for the accountingDeleted event
ipcRenderer.on('deleted', function (e, accountingId) {
    // Delete the row of the accounting from the UI
    $("#rowAccounting_" + accountingId).remove();

});
