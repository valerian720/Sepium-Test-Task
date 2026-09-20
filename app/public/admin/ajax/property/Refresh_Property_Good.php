<?php

require_once dirname(dirname(dirname(dirname(__DIR__)))) . '/src/bootstrap.php';

header('Content-Type: text/html; charset=utf-8');

// Упрощённая обезличенная копия реального legacy-обработчика.
function property($property)
{
    $place = '';
    if ($property['place_prop'] != '') {
        $place = '<div class="field-help">' . h($property['place_prop']) . '</div>';
    }

    $category_name = '';
    if($property['category_data'] && $property['category_data']['name_category']){
        $category_name = ' (' .h($property['category_data']['name_category']) . ')';
    }

    $idProp = $property['id'];
    $allOption = '';

    // basic input
    if ($property['type_prop'] == '1') {
        $result = '<div class="property-field name_select_rielt" data-property-type="'. $property['type_prop'] .'" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . $property['name_prop'] . $category_name . '</div>
            ' . $place . '
            <input type="text" class="text-input add-inp ag_pole_good js-input-saveable" placeholder="' . $property['name_prop'] . '">
        </div>';

    // dropdown
    } elseif ($property['type_prop'] == '2') {
        $answers = db()->query(
            "SELECT * FROM property_answer_s WHERE id_prop = '" . $idProp . "' ORDER BY sort_answer"
        );

        while ($answer = $answers->fetch()) {
            $allOption .= '<option value="' . $answer['id'] . '">' . $answer['answer_prop'] . '</option>';
        }

        $result = '<div class="property-field name_select_rielt" data-property-type="'. $property['type_prop'] .'" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . $property['name_prop'] . $category_name . '</div>
            ' . $place . '
            <select class="text-input ag_pole_good js-input-saveable">
                <option value="">Не выбрано</option>' . $allOption . '
            </select>
        </div>';

    // multiselect
    } elseif ($property['type_prop'] == '3') {
        $answers = db()->query(
            "SELECT * FROM property_answer_s WHERE id_prop = '" . $idProp . "' ORDER BY sort_answer"
        );
        $checkboxes = '';

        while ($answer = $answers->fetch()) {
            $checkboxes .= '<label class="choice line_chek">
                <input type="checkbox" class="js-input-saveable" data-val="' . $answer['id'] . '">
                <span class="ckeck_param">' . $answer['answer_prop'] . '</span>
            </label>';
        }

        $result = '<div class="property-field name_select_rielt" data-property-type="'. $property['type_prop'] .'" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . $property['name_prop'] . $category_name . '</div>
            ' . $place . '
            <div class="choice-grid checkbox_property ag_pole_good">' . $checkboxes . '</div>
        </div>';

    // positive number
    } elseif ($property['type_prop'] == '4') {
        $result = '<div class="property-field name_select_rielt" data-property-type="'. $property['type_prop'] .'" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . $property['name_prop'] . $category_name . '</div>
            ' . $place . '
            <input type="text" inputmode="decimal" class="text-input js-input-validated add-inp ag_pole_good js-input-saveable" placeholder="Числовое значение">
        </div>';
    // undefined type
    } else {
        $result = 'N/A';
    }

    return $result;
}

$category = isset($_POST['category']) ? $_POST['category'] : array();
$result = '';

// Legacy-алгоритм
if (is_array($category) && $category) {
        $properties = db()->prepare(
            "SELECT DISTINCT ps.id, ps.*  from category_s cs
            join property_s ps on FIND_IN_SET(cs.ID_category, ps.cat_prop)
            where FIND_IN_SET(cs.ID_category, :categories)
            ORDER BY ps.sort_prop"
        );
        $properties->execute(['categories' => implode(',', $category)]);

        while ($property = $properties->fetch()) {
            $result .= property($property);
        }
}

echo $result === '' ? 'no' : $result;
