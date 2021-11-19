function filterCustomerByState() {
    //get the state of the selected State from the filter dropdown
    var state_abbreviation = document.getElementById('state_filter').value
    //construct the URL and redirect to it
    window.location = '/customers/' + state_abbreviation
}
