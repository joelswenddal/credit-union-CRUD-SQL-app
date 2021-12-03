function searchCustomersByLast() {

    var last_name_search_string = document.getElementById('lastNameSearch').value;
    //construct the URL and redirect to it
    window.location = '/customers/search/' + encodeURI(last_name_search_string)
    /*
    $.ajax({
        url: '/customers/search/' + last_name_search_string,
        type: 'GET',
        success: function (result) {
            window.location.replace('/customers/search/' + encodeURI(last_name_search_string))
        }
    });
    */
}

/*
function searchCustomers() {

    var first_name_search = document.getElementById('firstNameSearch').value
    var last_name_search = document.getElementById('lastNameSearch').value
    var ssn_search = document.getElementById('ssnSearch').value
    var dob_search = document.getElementById('dobSearch').value
    //construct the URL and redirect to it
    window.location = '/customers/search/' + encodeURI(first_name_search) + encodeURI(last_name_search) + encodeURI(ssn_search) + encodeURI(dob_search)
}
*/