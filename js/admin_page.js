/// To the bottom there are some info, supposingly taken from the DB in the future.
document.addEventListener('DOMContentLoaded', function() {
    console.log('admin_page script is running');
    /*var food_stockpile = [
        {
            name: 'salt&pepper',
            units: 'gram',
            q_ty:
                [500,
                25000],
            expires_in:
                     [1,
                    10]
        },
        {
            name: 'beef',
            units: 'gram',
            q_ty:
                [1000,
                    3000],
            expires_in:
                [12,
                    18]
        },
        {
            name: 'pork',
            units: 'gram',
            q_ty:
                [5000,
                    23000],
            expires_in:
                [4,
                    18]
        },
        {
            name: 'salad',
            units: 'gram',
            q_ty:
                [5000],
            expires_in:
                [4]
        },
        {
            name: 'oil',
            units: 'mililitre',
            q_ty:
                [1000],
            expires_in:
                [40]
        },
        {
            name: 'sauce',
            units: 'mililitre',
            q_ty:
                [3200],
            expires_in:
                [14]
        }

    ];
*//*
    var drinks_stockpile = [
        {
            name: 'weissbier',
            units: 'litres',
            q_ty:[200,45],
            expires_in:[1,25]
        },
        {
            name: 'darkbier',
            units: 'litres',
            q_ty:[100,55],
            expires_in:[12,5]
        },
        {
            name: 'Orange Juice',
            units: 'litres',
            q_ty:[10,15],
            expires_in:[2,5]
        }
    ];
*/
    var orders = [
        {
            time: '01:00',
            items: [
                {
                    name: 'burger',
                    q_ty: 1
                },
                {
                    name: 'Orange Juice',
                    q_ty: 0.5
                }
            ],
            total_cost: 100
        },
        {
            time: '01:00',
            items: [
                {
                    name: 'burger',
                    q_ty: 5
                },
                {
                    name: 'WeissBier',
                    q_ty: 2.5
                }
            ],
            total_cost: 500
        }

    ];

    var employees = [
        {
            name: 'John',
            surname: 'Malkovic',
            position: 'Cook',
            manage_access: false,
            steward_access: true
        },
        {
            name: 'Matthew',
            surname: 'McConaughey',
            position: 'Steward',
            manage_access: false,
            steward_access: true
        },
        {
            name: 'James',
            surname: 'Hetfield',
            position: 'Manager',
            manage_access: true,
            steward_access: true
        },
        {
            name: 'Angela',
            surname: 'Gossow',
            position: 'Steward',
            manage_access: false,
            steward_access: true
        }
    ];/*
    var food_menue_burgers = [
        {
            name: 'burger1',
            ingredients: {
                'beef':1,
                'salt&pepper':1,
                'salad':2,
                'sauce':1
            },
            info: 'Best burger ever. Can cause addiction.',
            cost: 100
        },
        {
            name: 'burger2',
            ingredients: {
                'beef':2,
                'salt&pepper':1,
                'salad':2,
                'oil':1
            },
            info: 'Best burger ever, but with oil instead of sauce. Can cause addiction.',
            cost: 100
        }
    ];
    var food_menue_grill = [
        {
            name: 'grill1',
            ingredients: {
                'beef':3,
                'salt&pepper':1,               
                'oil':1
            },
            info: 'Best grill ever. Can cause addiction.',
            cost: 200
        },
        {
            name: 'grill2',
            ingredients: {
                'pork':3,
                'salt&pepper':1,               
                'oil':1
            },
            info: 'Best grill ever, but with pork instead of beef. Can cause addiction.',
            cost: 100
        }
    ];
    var drinks_menue = [
        {
            name: 'weissbier',

            info: 'Best beer ever. Can cause effect similar to Marijuana o LSD.',
            cost: 50
        },
        {
            name: 'darkbier',

            info: 'Best beer ever, but dark. Can cause effect similar to Marijuana o LSD.',
            cost: 50
        }
    ];*/
// the forEach method/*
/*
food_menue_grill.forEach(function(item){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/menu_grill_db_save', true);
    xhr.setRequestHeader("content-type","application/json");
    xhr.send(JSON.stringify(item));
})
*/





//Common for admin page - making the event listener on button to form get query and receive the markups for the stocks tables
var stocks_button = document.getElementById('stock_button');
stocks_button.addEventListener('click',function(){
    console.log('stocks click');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
        var content_holder = document.getElementById('content');
        content_holder.innerHTML = xhr.responseText;
        var stocks_content = document.createElement('div');
        stocks_content.setAttribute('id','stocks_content');
        content_holder.appendChild(stocks_content);
        
        
        getDB('/management/stocks/db').then(
            result => stocks_visual(result),
            error => console.log(error)
        );
        
        } else{
            console.log('the request is passing through stage'+ this.readyState+'and status is'+ this.status);
        }

    }
    xhr.open('get','/management/stocks',true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

})

//Creating the event listeners for menu and getting the markups from the file
var menu_button = document.getElementById('menu_button');
menu_button.addEventListener('click',function(){
    console.log('menu click');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
        var content_holder = document.getElementById('content');
        //content_holder.innerHTML = xhr.responseText;
        var menu_content = document.createElement('div');
        content_holder.innerHTML = xhr.responseText;
        //menu_content.onclick = remove_item_func;
        var menu_add_item = document.getElementById('menu_add_item');
        menu_add_item.onclick = add_item_fuction;
        
        menu_content.setAttribute('id','menu_content');
        content_holder.appendChild(menu_content);   
        
        getDB('/management/burgers/db').then(
            result => {
            var burgerHeader = document.createElement('h2');
            burgerHeader.innerText = 'Burgers!';
            menu_content.appendChild(burgerHeader);
            menu_visual(result)
            
            getDB('/management/grill/db').then(                
                result => {
                    var grillHeader = document.createElement('h2');
                    grillHeader.innerText = 'Grill!';
                    menu_content.appendChild(grillHeader);
                    menu_visual(result);
                   
                },
                    error  => console.log(error)
            )},
            error => console.log(error)
        );
        
        } else{
            console.log('the request is passing through stage'+ this.readyState+'and status is'+ this.status);
        }

    }
    xhr.open('get','/management/burger_stocks',true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
})
//Creating the event listener to serve the orders part of admin page
var orders_button = document.getElementById('orders_button');
orders_button.addEventListener('click',function(){
    console.log('orders click');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
        var content_holder = document.getElementById('content');
        content_holder.innerHTML = xhr.responseText;
        var orders_content = document.createElement('div');
        orders_content.setAttribute('id','orders_content');
        content_holder.appendChild(orders_content);        
        
        getDB('/management/orders/db').then(
            result => orders_visual(result),
            error => console.log(error)
        );        
        } else{
            console.log('the request is passing through stage'+ this.readyState+'and status is'+ this.status);
        }

    }
    xhr.open('get','/management/orders',true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

})
//Creating the event listener to serve the finance part of admin page
var finance_button = document.getElementById('finance_button');
finance_button.addEventListener('click',function(){
    console.log('finance click');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
        var content_holder = document.getElementById('content');
        content_holder.innerHTML = xhr.responseText;
        var orders_content = document.createElement('div');
        orders_content.setAttribute('id','finance_content');
        content_holder.appendChild(orders_content);        
        
        getDB('/management/orders/db').then(
            result => finance_visual(result),
            error => console.log(error)
        );        
        } else{
            console.log('the request is passing through stage'+ this.readyState+'and status is'+ this.status);
        }

    }
    xhr.open('get','/management/finance',true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

})
//Creating the event listener to serve the users part of admin page
var users_button = document.getElementById('users_button');
users_button.addEventListener('click',function(){
    console.log('users click');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
        var content_holder = document.getElementById('content');
        content_holder.innerHTML = xhr.responseText;
        var orders_content = document.createElement('div');
        orders_content.setAttribute('id','users_content');
        content_holder.appendChild(orders_content);        
        
        getDB('/management/users/db').then(
            result => users_visual(result),
            error => console.log(error)
        );        
        } else{
            console.log('the request is passing through stage'+ this.readyState+'and status is'+ this.status);
        }

    }
    xhr.open('get','/management/users',true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

})




//function that gets the DB using any url and returns the promise.
function getDB(url){
    return new Promise(function(resolve,reject){
        var xhr = new XMLHttpRequest();
            xhr.open('get',url,true);
            xhr.onload = function(){
                if (this.status == 200) {               
                    resolve(JSON.parse(xhr.response));
                } else{
                    reject(xhr.statusText);
                }
            };
            xhr.send();
    }) 
    }
















});