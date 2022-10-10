$(document).ready(function () {
    $('body').on('click', '.add_to_cart_btn', function (e) {
        e.preventDefault();

        var _this = $(this);
        var productId = $(this).attr('data-product-id');
        var referee_page = $(this).attr('data-referee-page') || 'cart.index';
        let is_donation = $(this).attr('data-is-donation');
        let data =  {_token: _token, product_id: productId, referee_page: referee_page};

        if (is_donation) {
            let donation_input = $('#donating_amount_'+productId);
            let donating_amount = $.trim(donation_input.val());
            donation_input.closest('div.form-group').removeClass('has-error');

            // do validation on the input field
            if (!donating_amount || isNaN(donating_amount)) {
                donation_input.closest('div.form-group').addClass('has-error');
                return;
            }

            // send the donation amount to request data
            data.donation_amount =  donating_amount;
        }


        $.ajax({
            url: baseUrl + '/cart/item/'+ $(this).attr('data-product-id') +'/quick-add',
            method: 'POST',
            data: data,
        }).done(function (data) {
            if (dataLayer && data.data.googleTags) {
                // let's get going and push it ..
                dataLayer.push(data.data.googleTags);
            }
            // laravel.ajax.successHandler(data)
            Salla.event.createAndDispatch('cart::add-item', {
                productImage: $(_this).parent().parent('.product').find('img').eq(0),
                data: data,
            });
        }).fail(laravel.ajax.errorHandler);
    });
});
