function updateCustomerByID(customer_id) {
    $.ajax({
        url: '/customers/' + customer_id,
        type: 'PUT',
        data: $('#updatecustomer').serialize(),
        success: function (result) {
            window.location.replace("../");  // should it be ../ ? Experiment. Possible jquery quirk
        }
    })
};

//WORKING ON THIS. INCORRECT TEMPLATE MAYBE