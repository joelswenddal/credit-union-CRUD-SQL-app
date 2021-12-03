function updateAccountTypeByType(account_type) {
    $.ajax({
        url: '/account_types/update/' + account_type,
        type: 'put',
        data: $('#updateaccounttype').serialize(),
        success: function (result) {
            window.location.replace("../");
        }
    })
};