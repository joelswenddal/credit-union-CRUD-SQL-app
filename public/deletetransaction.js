function deleteTransaction(transaction_id) {
    $.ajax({
        url: '/transactions/' + transaction_id,
        type: 'DELETE',
        success: function (result) {
            window.location.reload(true);
        }
    })
};