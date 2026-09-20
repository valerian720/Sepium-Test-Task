(function ($) {
    'use strict';

    function collectCategories() {
        var cats = [];

        $('.category_checked').each(function () {
            cats[cats.length] = $(this).attr('data-category-chpu');
        });

        return cats;
    }

    // Фрагмент упрощён из legacy main.js. Сейчас он неверно собирает часть типов полей.
    function collectPropertyValues() {
        var propertyMas = {};

        $('.name_select_rielt').each(function () {
            var propertyId = $(this).attr('data-property');
            var propertyType = $(this).attr('data-property-type');
            var value = "";
            switch (propertyType) {
                case '3':
                    let checkboxes = $(this).find('.choice input:checked');
                    let values = [];
                    checkboxes.each(function (i) { values.push($(this).data('val')); });
                    if (values) { value = values.join(':'); }
                    break;
                default:
                    value = $(this).find('input.ag_pole_good, select.ag_pole_good').first().val();
                    break;
            }

            if (value !== undefined && value !== '') {
                propertyMas[propertyId] = value;
            }
        });

        return propertyMas;
    }

    $('body').on('click', '.addgood_click', function () {
        var $button = $(this);

        $button.prop('disabled', true).text('Проверяем…');

        $.ajax({
            type: 'POST',
            url: './admin/ajax/Preview_Good_Payload.php',
            dataType: 'json',
            data: {
                cats: collectCategories(),
                property_mas: collectPropertyValues()
            },
            success: function (data) {
                $('.js-payload-preview').text(JSON.stringify(data, null, 2));
            },
            error: function () {
                $('.js-payload-preview').text('Не удалось проверить отправку.');
            },
            complete: function () {
                $button.prop('disabled', false).text('Проверить отправку');
            }
        });
    });
}(jQuery));
