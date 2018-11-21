
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//stocks visualization function
var stocks_visual = function (food_stockpile) {
    var content_holder = document.getElementById('stocks_content');
    console.log('function stocks_visual is running');
    //Stocks generation


    // head of the table
    var upper_line = document.createElement('div');
    upper_line.classList.add('stock_table_header');
    var upper_line_contents = [
        'Name',
        'Units',
        'Quantity',
        'Expires in(days)'
    ];
    function header_builder(arr) {
        for (var i = 0; i < upper_line_contents.length; i++) {
            var row = document.createElement('div');
            var name = document.createElement('p');

            row.classList.add('table_cell');
            name.innerHTML = arr[i];
            row.appendChild(name);
            upper_line.appendChild(row);
        }
        row = document.createElement('div');
        row.classList.add('table_cell');
        upper_line.appendChild(row);
        content_holder.appendChild(upper_line);
    }
    header_builder(upper_line_contents);

    // body of the table
    var order = [
        'name', 'units', 'q_ty', 'expires_in'
    ]

    function bodyBuilder() {
        for (var i = 0; i < food_stockpile.length; i++) {
            var line = document.createElement('div');
            line.classList.add('stock_table_line');


            order.forEach(function (key) {



                var row = document.createElement('div');

                row.classList.add('table_cell');
                if (Array.isArray(food_stockpile[i][key])) {
                    for (var k = 0; k < food_stockpile[i][key].length; k++) {
                        var name = document.createElement('p');
                        name.innerHTML = food_stockpile[i][key][k];
                        //below we check the remains of the stockpile and color red if they are low
                        if (key === "q_ty" && food_stockpile[i][key][k] < 5000) {
                            name.style.color = 'red';
                        } else if (key === "expires_in" && food_stockpile[i][key][k] < 5) {
                            name.style.color = 'red';
                        }

                        row.appendChild(name);

                    } line.appendChild(row);

                } else {
                    var name = document.createElement('p');
                    name.innerHTML = food_stockpile[i][key];
                    row.appendChild(name);
                    line.appendChild(row);
                }
            })

            var update_stock = document.createElement('button');
            update_stock.value = food_stockpile[i].name;
            content_holder.onclick = update_stock_func;
            update_stock.classList.add('table_cell', 'stock_update_button');
            update_stock.innerText = 'Update stock';

            line.appendChild(update_stock);
            content_holder.appendChild(line);
        }
    }
    bodyBuilder();

    //popup
    function update_stock_func(event) {
        
        if(event.target.tagName !== 'BUTTON') {return};
        var header = document.getElementsByClassName('stock_fill_popup_header');
        header[0].innerHTML = event.srcElement.value;
        var select = document.getElementById('quantity_and_expierydate_select');
        select.innerHTML = '';
        var number_in = 0;
        for (var i = 0; i < food_stockpile.length; i++) {
            if (event.srcElement.value === food_stockpile[i].name) {
                number_in = i;
                for (var j = 0; j < food_stockpile[i].q_ty.length; j++) {
                    var option = document.createElement('option');
                    option.innerHTML = food_stockpile[i].q_ty[j] + ' ' + food_stockpile[i].units + '(s)' + ' expires ' +
                        'in ' + food_stockpile[i].expires_in[j] + ' days.';
                    option.value = j;
                    select.appendChild(option);
                }

            }
        }

        var popup_content = document.getElementsByClassName('stock_fill_popup_content');
        //popup_content[0].insertBefore(select,popup_content[0].firstChild);

        console.log(popup_content[0]);

        // popup: remove button
        var removeBtn = document.getElementById('removeBtn');
        removeBtn.onclick = removeFunc;

        var updateInfo = {};
        updateInfo.name = event.srcElement.value;
        function removeFunc() {

            for (var k = 0; k < select.options.length; k++) {
                if (select.options[k].selected) {
                    var toDelete = select.options[k];
                    updateInfo.positionInArray = k;
                }
            }
            console.log(toDelete);
            select.removeChild(toDelete);
            var xhr = new XMLHttpRequest();
            xhr.open('post', '/management/stocks/db/remove_amount', true);
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('Partial removal success');
                }
            }
            console.log(updateInfo);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(updateInfo));
            if (toDelete === undefined) {
                console.log(toDelete);
                //debugger;
                alert('Please, select an option to delete.');
            } else {
                console.log('to remove: ' + food_stockpile[number_in].name + ', qty:' + food_stockpile[number_in].q_ty[toDelete] +
                    ', which expires in:' + food_stockpile[number_in].expires_in[toDelete]);
            }
        };

        var stocks_update_buttons_top = document.getElementsByClassName('stocks_update_buttons_top')[0];
        stocks_update_buttons_top.onclick = addAmount;

        function addAmount() {
            var result = {};
            var amountForm = document.forms.adding_quantity_and_expierydate;
            console.log(amountForm.elements.length);
            for (var i = 0; i < amountForm.elements.length; i++) {
                if (amountForm.elements[i].tagName === 'INPUT') {
                    result[amountForm.elements[i].name] = amountForm.elements[i].value;
                }
            }
            console.log(result);
            result.name = event.srcElement.value;

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/management/stocks/db/add_amount', true)

            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('info added successfully');
                    var newOption = document.createElement('option');
                    newOption.innerHTML = result.q_ty + ' ' /*+ food_stockpile[i].units*/ + '(s)' + ' expires in'
                        + result.expires_in + ' days.';
                    //newOption.value = j;
                    select.appendChild(newOption);

                    document.forms.adding_quantity_and_expierydate.reset();
                    /////// Вот тут надо заскриптовать добавление элементов в селект


                }
            }

            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(result));



        }

        var stocks_item_total_removal = document.getElementById('stock_item_total_removal');
        stocks_item_total_removal.onclick = removeTotal;
        function removeTotal() {
            var removeQuery = {};
            removeQuery.name = event.srcElement.value;
            console.log(removeQuery);
            var xhr = new XMLHttpRequest();
            xhr.open('post', '/management/stocks/db/remove_item', true);
            xhr.onreadystatechange = function () {
                if (this.status === 200 && this.readyState === 4) {
                    console.log('removal is success');
                    var stocks_button = document.getElementById('stock_button');
                    var refresh = new Event('click');
                    stocks_button.dispatchEvent(refresh);
                }
            }
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(removeQuery));
        }



        /// opening and closing the popup
        var popup_wrapper = document.getElementsByClassName('stock_fill_popup_wrapper');
        popup_wrapper[0].style.display = 'block';
        var btnClose = document.getElementById('btnOK');
        btnClose.onclick = function () {
            var popup_wrapper = document.getElementsByClassName('stock_fill_popup_wrapper');
            popup_wrapper[0].style.display = 'none';
            //debugger;
            console.log(popup_content);
            //select.remove();
            //removeBtn.removeEventListener('click', removeFunc);
            var stocks_button = document.getElementById('stock_button');
            var refresh = new Event('click');
            stocks_button.dispatchEvent(refresh);

        };


    };

    //adding stock items popup
    var stocks_add_popup_wrapper = document.getElementsByClassName('stocks_add_popup_wrapper')[0];
    var stock_item_add = document.getElementById('stocks_add_item');
    stock_item_add.addEventListener('click', function () {
        stocks_add_popup_wrapper.style.display = 'block';
    })

    var menu_item_add_cancel_button = document.getElementById('stock_item_add_cancel_button');
    console.log(menu_item_add_cancel_button);
    menu_item_add_cancel_button.addEventListener('click', add_stock_item_closefunc);
    function add_stock_item_closefunc() {

        stocks_add_popup_wrapper.style.display = 'none';
        document.forms.adding_stock_item.reset();

    };


    document.forms.adding_stock_item.onsubmit = add_category;

    function add_category() {
        event.preventDefault();
        console.log('submit!')

        var result = {};
        var amountForm = document.forms.adding_stock_item;
        console.log(amountForm.elements.length);
        for (var i = 0; i < amountForm.elements.length; i++) {
            if (amountForm.elements[i].tagName === 'INPUT') {
                result[amountForm.elements[i].name] = amountForm.elements[i].value;
            }
        }
        result.q_ty = [];
        result.expires_in = [];

        var xhr = new XMLHttpRequest();
        xhr.open('post', '/management/stocks/db/add_item', true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log('adding is successfull');
                add_stock_item_closefunc();
                var stocks_button = document.getElementById('stock_button');
                var refresh = new Event('click');
                stocks_button.dispatchEvent(refresh);

            }
        }
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(result));

    }




};

document.addEventListener('DOMContentLoaded', function () {
    console.log('admin_stocks script is running');






})