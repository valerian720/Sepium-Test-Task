(function ($) {
    'use strict';
    const placeholder = "";

    // Выбор категории в товаре и обновление блока характеристик.
    $('body').on('change', '.js-category', function () {
        var category = [];
        var $properties = $('.property_all');

        $(this).closest('.add_good_name_category')
            .toggleClass('category_checked is-selected', this.checked);

        $('.category_checked').each(function () {
            category[category.length] = $(this).attr('data-category-id');
        });

        $properties.addClass('is-loading').attr('aria-busy', 'true');

        $.ajax({
            type: 'POST',
            url: './admin/ajax/property/Refresh_Property_Good.php',
            dataType: 'html',
            data: { category: category },
            success: function (data) {
                if (data != 'no') {
                    $properties.html(data);
                    loadSavedInputs();
                }
                else {
                    $properties.html(placeholder);
                }
            },
            error: function () {
                $properties.html('<div class="error-state">Не удалось обновить характеристики.</div>');
            },
            complete: function () {
                $properties.removeClass('is-loading').attr('aria-busy', 'false');
            }
        });
    });


    // text input validator
    $(".editor-grid").on("change", ".js-input-validated", function (e) {
        const el = $(this);
        // force value to be positive integer
        el.val(Math.abs(~~(el.val())));
    });

    // local saveable inputs
    $(".editor-grid").on("change", ".js-input-saveable", function (e) {
        const el = $(this);
        
        const container = el.closest('.name_select_rielt');

        const index = container.attr('data-property');
        const type = container.attr('data-property-type');

        let selectedVal = el.val();
        if (el.attr('type') == 'checkbox') {
            const checkboxes = container.find('.choice input:checked');
            const values = [];
            checkboxes.each(function (i) { values.push($(this).data('val')); });
            if (values) { selectedVal = values.join(':'); }
        }


        const val = {'type': type, 'value': selectedVal};
        updateSavedInputs(index, val);
    });
    // retreave locally saved inputs
   const loadSavedInputs = function () {
        var data = JSON.parse(localStorage.getItem("data")) || [];
       data.forEach((row, id) => {
            const container = $('[data-property="' + id + '"]');
            if (row && container.length) {
                switch (row.type) {
                    case '1':
                        container.find("input.text-input").val(row.value);
                        break;
                    case '2':
                        container.find("select.text-input").val(row.value);
                        break;
                    case '3':
                        const values = row.value.split(':');
                        container.find('.choice input').prop('checked', false);
                        values.forEach(value => {
                            container.find('.choice [data-val="' + value + '"]').prop('checked', true);
                        });
                        break;
                    case '4':
                        container.find("input.text-input").val(row.value);
                        break;
                
                    default:
                        console.log('err');
                        break;
                }
            }
       });
    }
    // retreave locally saved inputs
    const updateSavedInputs = function (index, val) {
        console.log('updating...', index, val);
        const data = JSON.parse(localStorage.getItem("data")) || [];
        data[index] = val;
        console.log(data);
        
        localStorage.setItem("data", JSON.stringify(data));
    }

    $( document ).ready(function() {
        loadSavedInputs();
    });
}(jQuery));
