// PatientList data array for filling in info box
var patientList = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the patient table on initial page load
    populateTablePatient();

    // Username click
    $('#patientList table tbody').on('click', 'td a.linkshowpatient', showPatientInfo);

    // Add patient
    $('#btnAddPatient').on('click', addPatient);

    // Delete patient
    $('#patientList table tbody').on('click', 'td a.linkdeletepatient', deletePatient);
});

// Functions =============================================================

// Fill table with data
function populateTablePatient() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/patient/patientList', function( data ) {
        patientList = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowpatient" rel="' + this.lastName + '">' + this.lastName + '</a></td>';
            tableContent += '<td>' + this.age + '</td>';
            tableContent += '<td><a href="#" class="linkdeletepatient" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#patientList table tbody').html(tableContent);
    });
};

// Show Patient Info
function showPatientInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve lastName from link rel attribute
    var patientName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = patientList.map(function (arrayItem) {
        return arrayItem.lastName;
    }).indexOf(patientName);

    // Get our patient Object
    var patientObject = patientList[arrayPosition];

    //Populate Info Box
    $('#patientInfoFirstName').text(patientObject.firstName);
    $('#patientInfoLastName').text(patientObject.lastName);
    $('#patientInfoAge').text(patientObject.age);
    $('#patientInfoGender').text(patientObject.sex);

    //TODO display drugs and treatments
    // avec une liste de treatments et un bouton pour les supprimer
    // et un form pour ajouter un treatment
    // sur angular evidemment

};

// Add Patient
function addPatient(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addPatient input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

        // If it is, compile all user info into one object
        var newPatient = {
            'firstName': $('#addPatient fieldset input#inputPatientFirstName').val(),
            'lastName': $('#addPatient fieldset input#inputPatientLastName').val(),
            'age': $('#addPatient fieldset input#inputPatientAge').val(),
            'sex': $('#addPatient fieldset input#inputPatientSex').val(),
            'drugs': [],
            'treatments': []
        }

        // Use AJAX to post the object to our addPatient service
        $.ajax({
            type: 'POST',
            data: newPatient,
            url: '/patient/addPatient',
            dataType: 'JSON'
        }).done(function( response ) {

            if (response.msg === '') {
                // Clear the form inputs
                $('#addPatient fieldset input').val('');

                // Update the table
                populateTablePatient();

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

// Delete Patient
function deletePatient(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this patient ?');

    // Check and make sure the user confirmed
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/patient/deletePatient/' + $(this).attr('rel')
        }).done(function( response ) {
            if (response.msg === '') {

            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTablePatient();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};