function updateCustomerByID(customer_id) {
    $.ajax({
        url: '/customers/update/' + customer_id,
        type: 'PUT',
        data: $('#updatecustomer').serialize(),
        success: function (result) {
            window.location.replace("../");
        }
    })
};



