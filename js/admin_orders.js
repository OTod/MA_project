function orders_visual(orders_db) {
    console.log(orders_db);

    var content_holder = document.getElementById('orders_content');

    var upper_line = document.createElement('div');
    upper_line.classList.add('stock_table_header');
    var upper_line_contents = [
        'time',
        'items',
        'total_amount',
        'total_price'
    ];
    function header_builder(arr) {
        for (var i = 0; i < upper_line_contents.length; i++) {
            var row = document.createElement('div');
            var name = document.createElement('p');
            name.classList.add('triangle_top');
            row.classList.add('table_cell');
            name.innerHTML = arr[i];
            row.appendChild(name);
            upper_line.appendChild(row);
        }

        content_holder.appendChild(upper_line);
    }
    header_builder(upper_line_contents);

    
  
    
    function bodyBuilder() {
        for (var i = 0; i < orders_db.length; i++) {
            var line = document.createElement('div');
            line.classList.add('stock_table_line');
            for (var j = 0; j < upper_line_contents.length; j++) {

                for (var key in orders_db[i]) {
                    if(key === upper_line_contents[j]){
                    var row = document.createElement('div');

                    row.classList.add('table_cell');
                    if (orders_db[i][key] instanceof Object) {
                        //for (var k = 0; k < orders_db[i][key].length; k++) {
                            console.log(orders_db[i][key]);
                            for(order in orders_db[i][key]){
                            var name = document.createElement('p');
                            console.log(orders_db[i][key][order]);
                            name.innerText =order+'....'+ orders_db[i][key][order]+' pcs';

                            row.appendChild(name);

                        } line.appendChild(row);

                    } else {
                        var name = document.createElement('p');
                        name.innerHTML = orders_db[i][key];
                        row.appendChild(name);
                        line.appendChild(row);
                    }}

                }
            }
            content_holder.appendChild(line);
        }
    }
    bodyBuilder();




}



document.addEventListener('DOMContentLoaded', function () {


})