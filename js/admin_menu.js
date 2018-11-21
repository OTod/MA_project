
//stocks visualization function
var menu_visual = function (food_stockpile) {
    var content_holder = document.getElementById('menu_content');
    console.log('function stocks_visual is running');
    //Stocks generation


    // head of the table
    var upper_line = document.createElement('div');
    upper_line.classList.add('stock_table_header');
    var upper_line_contents = [
        'Name',
        'INgredients',
        'Info',
        'Cost'
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
        'name','ingredients','info','cost'
    ];
    
    function bodyBuilder() {
        console.log(food_stockpile);
        for (var i = 0; i < food_stockpile.length; i++) {
            var line = document.createElement('div');
            line.classList.add('stock_table_line');
            
            //for (var key in food_stockpile[i]) {
                order.forEach(function(key){

                
                var row = document.createElement('div');
                row.classList.add('table_cell');
                if (food_stockpile[i][key] instanceof Object) {
                    //for(var k = 0; k<food_stockpile[i][key].length; k++){
                    for (var key2 in food_stockpile[i][key]) {
                        var name = document.createElement('p');
                        name.innerHTML = key2 +'....'+ food_stockpile[i][key][key2];
                        row.appendChild(name);
                    } line.appendChild(row);
                } else {
                    var name = document.createElement('p');
                    name.innerHTML = food_stockpile[i][key];
                    row.appendChild(name);
                    line.appendChild(row);
                }
            })
            //}

            var remove_btn = document.createElement('button');
            remove_btn.value = food_stockpile[i].name;
            remove_btn.type = 'button';
            remove_btn.classList.add('table_cell', 'stock_update_button');
            remove_btn.innerText = 'X';
            remove_btn.onclick = remove_item_func;
            line.appendChild(remove_btn);
            content_holder.appendChild(line);
        }
    }
    bodyBuilder();
    /*
    var content = document.getElementById('content');
    var buttons_container =  document.createElement('div');
    var button_row = document.createElement('div');
    buttons_container.classList.add('buttons_container');
    button_row.classList.add('button_row');
    
    
    var button = document.createElement('button');
    button.type = 'button';
    button.classList.add('menu_buttons');
    button.innerText = 'Add Item';
    button_row.appendChild(button);
    var button2 = document.createElement('button');
    button2.type = 'button';
    button2.classList.add('menu_buttons');
    button2.innerText = 'See Menu';
    button_row.appendChild(button2);
    
    buttons_container.appendChild(button_row);
    content.appendChild(buttons_container);*/
    //popup/*



    /* var header = document.getElementsByClassName('stock_fill_popup_header');
     header[0].innerHTML = event.srcElement.value;
     var select = document.createElement('select');
     select.size = 5;
     var number_in = 0;
     for(var i = 0; i<food_stockpile.length; i++ ){
         if (event.srcElement.value === food_stockpile[i].name){
             number_in=i;
             for(var j =0; j<food_stockpile[i].q_ty.length; j++){
                      var option = document.createElement('option');
                      option.innerHTML = food_stockpile[i].q_ty[j] + ' ' + food_stockpile[i].units+'(s)'+ ' expires ' +
                          'in '+ food_stockpile[i].expires_in[j]+' days.';
                      option.value = j;
                      select.appendChild(option);
             }

         }
     }

     var popup_content = document.getElementsByClassName('stock_fill_popup_content');
     popup_content[0].insertBefore(select,popup_content[0].firstChild);

     console.log(popup_content[0]);

     // popup: remove button
     var removeBtn = document.getElementById('removeBtn');
     removeBtn.addEventListener('click',removeFunc);

     function removeFunc(){
             for (var k = 0; k < select.options.length; k++) {

                 if (select.options[k].selected) {
                     var toDelete = k;
                 }
             }
         console.log(toDelete);

         if(toDelete=== undefined){
             console.log(toDelete);
                 //debugger;
             alert('Please, select an option to delete.');
         } else{
             console.log('to remove: ' + food_stockpile[number_in].name + ', qty:' + food_stockpile[number_in].q_ty[toDelete] +
                 ', which expires in:' + food_stockpile[number_in].expires_in[toDelete]);
         }
     };

     /// opening and closing the popup
     var popup_wrapper = document.getElementsByClassName('stock_fill_popup_wrapper');
     popup_wrapper[0].style.display = 'flex';
     var btnClose = document.getElementById('btnOK');
     btnClose.addEventListener('click',function(){
         var popup_wrapper = document.getElementsByClassName('stock_fill_popup_wrapper');
         popup_wrapper[0].style.display = 'none';
         //debugger;
         //console.log(popup_content);
         select.remove();
         removeBtn.removeEventListener('click',removeFunc);
         // тут есть баг!!!. если поочередно открывать и просто закрывать каждый попап, предварительно раскомментировав
         // консоллог, то он будет выводиться для каждого из уже нажимаемых элементов. сначала раз, потом дважды,
         // потом трижды и т д.
     });*/




};
function remove_item_func(event) {
    var name_remove = { name: event.target.value };
    var xhr = new XMLHttpRequest();
    console.log(name_remove);

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var event = new Event('click');
            menu_button.dispatchEvent(event);

            console.log('removal is success');
        }
    }
    xhr.open('post', '/management/db_remove', true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(name_remove));

}
function add_item_fuction() {

    console.log(document.getElementsByClassName('ingredients')[0].children);

    function popup_open() {
        var popup_wrapper = document.getElementsByClassName('menu_add_popup_wrapper');
        popup_wrapper[0].style.display = 'flex';
        var ingredients_container = document.getElementsByClassName('ingredients_container')[0];
        function add_ingredient() {
            var stocks_promse = new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('get', '/management/stocks/db', true);
                xhr.onload = function () {
                    if (this.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.statusText);
                    }
                };
                xhr.send();
            })
            stocks_promse.then(
                result => {
                    var div_item = document.createElement('div');
                    div_item.classList.add('ingredients_item');
                    var select = document.createElement('select');
                    select.name = 'ingrids';
                    result.forEach(function (item) {
                        var option = document.createElement('option');
                        option.value = item.name;
                        option.innerText = item.name;
                        select.appendChild(option);
                    })
                    var input = document.createElement('input');
                    input.type = 'text';
                    input.name = 'amount';
                    input.placeholder = 'amount';
                    input.size = '4';
                    input.required = 'true';
                    var units = document.createElement('span');
                    units.classList.add('new_item_units');
                    var remove_ingredient_item = document.createElement('button');
                    remove_ingredient_item.type = 'button';
                    remove_ingredient_item.innerText = 'X';
                    remove_ingredient_item.onclick = function (event) {
                        ingredients_container.removeChild(event.target.parentNode);
                        console.log(event.target.parentNode);
                    }
                    div_item.appendChild(select);
                    div_item.appendChild(input);
                    div_item.appendChild(units);
                    div_item.appendChild(remove_ingredient_item);
                    ingredients_container.appendChild(div_item);
                    console.log(result);
                },
                error => console.log(error)
            );
        }
        ingredients_container.innerHTML = '';
        add_ingredient();
        var add_ingrid_button = document.getElementById('ingredient_add_button');
        add_ingrid_button.onclick = add_ingredient;

        document.forms.adding_menu_item.onsubmit = function () {

            event.preventDefault();
            var data = Array.from(this.elements);
            var outputData = {};
            outputData.ingredients = {};
            for (var i = 0; i < data.length; i++) {

                if (data[i].tagName !== 'BUTTON') {
                    console.log(data[i].value);
                    if (data[i].value === '') {
                        alert('please, enter correct');
                        break;
                    } else {
                        if (data[i].name === 'ingrids') {
                            var ingredient_name = data[i].value;
                            continue;
                        } else if (data[i].name === 'amount' && ingredient_name) {
                            outputData.ingredients[ingredient_name] = data[i].value;
                            continue;
                        } else if (data[i].name === 'cost') {
                            outputData[data[i].name] = +data[i].value;
                            continue;
                        } else {
                            outputData[data[i].name] = data[i].value;
                        }
                    }
                }
            }
            console.log(outputData);
            console.log(outputData.section);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '' + outputData.section, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(outputData));

            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    menu_window_update();
                }
            }



            //Вот тут надо продолжить. Тут должна быть функция отправки всего обьекта в базу данных

            popup_close();


        }
    }
    popup_open();

    function menu_window_update() {
        var event = new Event('click');
        menu_button.dispatchEvent(event);
    }



    var close_button = document.getElementById('menu_item_add_cancel_button');
    close_button.onclick = popup_close;
    function popup_close() {
        var popup_wrapper = document.getElementsByClassName('menu_add_popup_wrapper');
        popup_wrapper[0].style.display = 'none';
        console.log(document.forms.adding_menu_item);
        document.forms.adding_menu_item.reset();

    }

}





document.addEventListener('DOMContentLoaded', function () {
    console.log('admin_menu script is running');

})
