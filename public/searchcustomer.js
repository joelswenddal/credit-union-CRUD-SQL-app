function searchCustomers() {
    
    var first_name_search  = document.getElementById('firstNameSearch').value
    var last_name_search  = document.getElementById('lastNameSearch').value
    var ssn_search  = document.getElementById('ssnSearch').value
    var dob_search  = document.getElementById('dobSearch').value
    //construct the URL and redirect to it
    window.location = '/customers/search/' + encodeURI(first_name_search) + encodeURI(last_name_search) + encodeURI(ssn_search) + encodeURI(dob_search)
}