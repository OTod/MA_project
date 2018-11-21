
//function that takes the object of the menu_item(name:Sring,ingredients:Object,info:String,cost:Number) ad returns the food card element node.
function foodcard_create(menu_item_object, log) {

    var li = document.createElement('li');
    li.classList.add('food_card');
    var rowleft = document.createElement('div');
    rowleft.classList.add('food_card_rowLeft');

    var upper_line = document.createElement('div');
    upper_line.classList.add('upper_line');
    var name_price = document.createElement('div');
    name_price.classList.add('name_price');
    var name = document.createElement('p');
    name.classList.add('name');
    name.innerText = menu_item_object.name;
    var price = document.createElement('p');
    price.classList.add('price');
    price.innerText = 'Price:' + menu_item_object.cost;
    name_price.appendChild(name);
    name_price.appendChild(price);
    var content_short = document.createElement('div');
    content_short.classList.add('contents_short');
    var ingrids = document.createElement('p');
    ingrids.innerText = 'Ingredients: ' + Object.keys(menu_item_object.ingredients).join(', ');
    content_short.appendChild(ingrids);
    upper_line.appendChild(name_price);
    upper_line.appendChild(content_short);

    var lower_line = document.createElement('div');
    lower_line.classList.add('lower_line_text');
    var header = document.createElement('h3');
    header.classList.add('description_header');
    header.innerText = 'What the...?';
    var descr = document.createElement('p');
    descr.classList.add('description_text');
    descr.innerText = menu_item_object.info;
    lower_line.appendChild(header);
    lower_line.appendChild(descr);

    rowleft.appendChild(upper_line);
    rowleft.appendChild(lower_line);
    li.appendChild(rowleft);
    if (log) {
        var rowright = document.createElement('div');
        rowright.classList.add('food_card_rowRight');

        var plus = document.createElement('p');
        plus.classList.add('food_card_button');
        plus.innerText = '+';
        plus.setAttribute('name', menu_item_object.name);
        plus.setAttribute('cost', menu_item_object.cost);
        plus.setAttribute('action', 'plus');

        var amount = document.createElement('p');
        amount.classList.add('amount_selected');
        amount.setAttribute('name', menu_item_object.name);

        var minus = document.createElement('p');
        minus.classList.add('food_card_button');
        minus.innerText = '-';
        minus.setAttribute('name', menu_item_object.name);
        minus.setAttribute('cost', menu_item_object.cost);
        minus.setAttribute('action', 'minus');

        rowright.appendChild(plus);
        rowright.appendChild(amount);
        rowright.appendChild(minus);
        li.appendChild(rowright);
    }
    
    
    return (li);
}
//function that takes an url of the db and returns a promise
function getDB(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.onload = function () {
            if (this.status == 200) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.send();
    });
}
function getLogged() {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (!!this.response) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.statusText);
                }
            }
        };
        xhr.open('get', '/logged', true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send();
    })

}
function createMenu(log){
    //filling burgers menu from the db/*
    var burgers = document.getElementById('burgers');
    getDB('/management/burgers/db').then(
        result => {
            console.log(result);
            result.forEach(function (item) {
                burgers.appendChild(foodcard_create(item,log));
            })
            //Filling grill menu from the DB
            var grills = document.getElementById('grills');
            getDB('/management/grill/db').then(
                result => {
                    console.log(result);
                    result.forEach(function (item) {
                        grills.appendChild(foodcard_create(item,log));
                    })
                },
                error => console.log(error)
            )
        },
        error => console.log(error)
    )
}

document.addEventListener('DOMContentLoaded', function () {
    
    //changing the page in order to suit the profile properties
    getLogged().then(
        result => {
            console.log('result is ', result);
            var logged = true;
            createMenu(logged);


        },
        error => {
            console.log(error)
            var menu_container = document.getElementsByClassName('menu_container')[0];
            menu_container.style.marginTop = '100px';
            var orderLine = document.getElementsByClassName('order_line')[0];
            orderLine.style.display = 'none';
            var logged = false;  
            createMenu(logged);      
        }

    )






    var menu_container = document.getElementsByClassName('menu_container')[0];
    var order_notation_text = document.getElementsByClassName('order_notation_text')[0];
    /* Function receives the event target, if the target has necessary attributes, it returns object whicn  */
    var order = {
        total_amount: 0,
        total_price: 0,
        items: {
            //name:quantity
        },
        add_item(name, price) {
            this.total_amount += 1;
            this.total_price += +price;
            if (this.items[name]) {
                this.items[name] += 1;
            } else {
                this.items[name] = 1;;
            }
        },
        remove_item(name, price) {
            this.total_amount -= 1;
            this.items[name] -= 1;
            this.total_price -= +price;
            if (this.items.name === 0) {
                delete this.items.name;
            }
        },
        clear_order() {
            this.total_amount = 0;
            this.total_price = 0;
            delete this.items;

        }


    };

    menu_container.addEventListener('click', function (event) {

        if (event.target.getAttribute('name')) {
            console.log(event.target.getAttribute('cost'));
            console.log(event.target.getAttribute('action'));

            var amount = document.getElementsByClassName('amount_selected');
            for (var i = 0; i < amount.length; i++) {
                if (amount[i].getAttribute('name') === event.target.getAttribute('name')) {

                    if (event.target.getAttribute('action') === 'plus' && +amount[i].innerText >= 0) {
                        amount[i].innerText = +amount[i].innerText + 1;
                        order.add_item(event.target.getAttribute('name'), event.target.getAttribute('cost'))
                    } else if (+amount[i].innerText > 0) {
                        amount[i].innerText = +amount[i].innerText - 1;
                        order.remove_item(event.target.getAttribute('name'), event.target.getAttribute('cost'))
                    }
                }
            }
        }



        order_notation_text.innerText = order.total_amount + '   items with total cost of  ' + order.total_price;

    })
    var clear_crate = document.getElementById('clear_crate');
    clear_crate.addEventListener('click', clearCrateFunc);
    function clearCrateFunc() {
        console.log('click');
        order.clear_order();
        order_notation_text.innerText = order.total_amount + '   items with total cost of  ' + order.total_price;
        var amount = document.getElementsByClassName('amount_selected');
        for (var i = 0; i < Object.keys(amount).length; i++) {
            amount[i].innerText = "";
        }
        var orderItems = document.getElementsByClassName('orderItems')[0];
        orderItems.innerHTML = '';
    };

    var approve = document.getElementById('order-approve');
    approve.addEventListener('click', function () {
        var orders_total_popup_wrapper = document.getElementsByClassName('orders_total_popup_wrapper')[0];
        create_popup(order);
        console.log('click');
        orders_total_popup_wrapper.style.display = 'block';

    })
    var total_order_decline = document.getElementById('total_order_decline');
    total_order_decline.addEventListener('click', function () {
        var orders_total_popup_wrapper = document.getElementsByClassName('orders_total_popup_wrapper')[0];
        orders_total_popup_wrapper.style.display = 'none';
    })

    var total_order_approve = document.getElementById('total_order_approve');
    total_order_approve.addEventListener('click', function () {
        if (!order.total_amount == 0) {
            var now = new Date();
            var xhr = new XMLHttpRequest();
            xhr.open('post', 'management/orders/db/add_item', true)
            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    console.log('success!');
                }
            }
            xhr.setRequestHeader("Content-type", "application/json");
            order.time = now;
            xhr.send(JSON.stringify(order));
            var orders_total_popup_wrapper = document.getElementsByClassName('orders_total_popup_wrapper')[0];
            orders_total_popup_wrapper.style.display = 'none';

            clearCrateFunc();
            alert('Your order is accepted. Thanks!');
        } else {
            alert('the crate is empty!');
        }
    })



    function create_popup(obj) {
        var orderItems = document.getElementsByClassName('orderItems')[0];
        console.log(obj);
        for (key in obj.items) {
            console.log('item');
            var line = document.createElement('div');
            line.classList.add('order_line_popup');
            var name = document.createElement('p');
            name.classList.add('order_line_name');
            var q_ty = document.createElement('p');
            q_ty.classList.add('order_line_q_ty');
            name.innerText = key;
            q_ty.innerText = obj.items[key];
            line.appendChild(name);
            line.appendChild(q_ty);
            orderItems.appendChild(line);
        }

        var total = document.getElementsByClassName('total')[0];
        total.innerText = 'Total price is: ' + order.total_price;
    }



})