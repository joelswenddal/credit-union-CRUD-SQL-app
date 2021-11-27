function deleteAccountCustomer(customer_ID, account_ID){
    $.ajax({
        url: '/accounts_customers/customer_ID/' + customer_ID + '/account_ID/' + account_ID,
        type: 'DELETE',
        success: function(result){
              window.location.reload(true)
        }
    })
  };