// drugList data array for filling in info box
var drugList = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the patient table on initial page load
    populateTableDrug();

    // Add drug
    $('#btnAddDrug').on('click', addDrug);

    // Delete drug
    $('#drugList table tbody').on('click', 'td a.linkdeletedrug', deleteDrug);
});

// Functions =============================================================

// Fill table with data
function populateTableDrug() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/drug/drugList', function( data ) {
        drugList = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.code + '</td>';
            tableContent += '<td><a href="#" class="linkdeletedrug" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#drugList table tbody').html(tableContent);
    });
};

// Add Drug
function addDrug(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addDrug input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

        // If it is, compile all user info into one object
        var newDrug = {
            'name': $('#addDrug fieldset input#inputDrugName').val(),
            'code': $('#addDrug fieldset input#inputDrugCode').val()
        }

        // Use AJAX to post the object to our addPatient service
        $.ajax({
            type: 'POST',
            data: newDrug,
            url: '/drug/addDrug',
            dataType: 'JSON'
        }).done(function( response ) {

            if (response.msg === '') {
                // Clear the form inputs
                $('#addDrug fieldset input').val('');

                // Update the table
                populateTableDrug();

            }
            else {
                // If something goes wrong, display the error message
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Drug
function deleteDrug(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this drug ?');

    // Check and make sure the user confirmed
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/drug/deleteDrug/' + $(this).attr('rel')
        }).done(function( response ) {
            if (response.msg === '') {

            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTableDrug();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};