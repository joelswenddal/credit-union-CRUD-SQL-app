/*
function filterCustomerByState() {
    //get the state of the selected State from the filter dropdown
    var state_abbreviation = document.getElementById('state_filter').value
    //construct the URL and redirect to it
    window.location = '/customers/' + state_abbreviation
}
*/



function filterCustomerByState() {
    //get the state of the selected State from the filter dropdown
    var state_abbreviation = document.getElementById('state_filter').value
    //construct the URL and redirect to it
    $.ajax({
        url: '/customers/' + state_abbreviation,
        type: 'GET',
        success: function (result) {
            window.location.replace('/customers/' + state_abbreviation);
        }
    })
}





