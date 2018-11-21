var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');


//connectiong to the database
mongoose.connect('mongodb://localhost:27017/restaurant', { useNewUrlParser: true });
//creating a schema for users
var usersSchema = new mongoose.Schema({ login: String, mail: String, name: String, password: String, status: String, surname: String })
//creating a model for users
var users = mongoose.model('users', usersSchema);
//creating a schema for stocks
var foodStockSchema = new mongoose.Schema({ name: String, units: String, q_ty: Array, expires_in: Array })
//creating a model for stocks
var foodStock = mongoose.model('foodStock', foodStockSchema);
//creating a schema for drinks stocks
var drinksStockSchema = new mongoose.Schema({ name: String, units: String, q_ty: Array, expires_in: Array })
//creating a model for drinks stocks
var drinkStock = mongoose.model('drinkStock', drinksStockSchema);
//creating a schema for food menu - burgers
var burgersMenuItemSchema = new mongoose.Schema({ name: String, ingredients: Object, info: String, cost: Number })
//creating a model for food menu of burgers
var burgersMenuItem = mongoose.model('burgersMenuItem', burgersMenuItemSchema);
//creating a schema for food menu - grill
var grillMenuItemSchema = new mongoose.Schema({ name: String, ingredients: Object, info: String, cost: Number })
//creating a model for food menu of grill
var grillMenuItem = mongoose.model('grillMenuItem', grillMenuItemSchema);
//creating a schema for orders
var ordersSchema = new mongoose.Schema({ time: Date, total_amount: Number, total_price: Number, items: Object })
//creating a model for orders
var ordersItem = mongoose.model('ordersSchema', ordersSchema);


module.exports = function (app) {

    //serving main page on '/' request:
    app.get('/', function (req, res) {
        var fileName = path.join(__dirname + '/../html/index.html');

        res.sendFile(fileName, function (err) {
            if (err) throw err;
        })
    })

    //serving food menue page
    app.get('/Foodmenu', function (req, res) {
        var fileName = path.join(__dirname + '/../html/Food_menu.html');

        res.sendFile(fileName, function (err) {
            if (err) throw err;
        })
    })

    // serving the POSt request /register and saving the incoming object to the DB
    app.post('/register', function (req, res) {
            req.body.name = req.body.name.toLowerCase();
                 console.log(req.body);
            var newUser = users(req.body).save(function (err, data) {
            if (err) throw err;
            console.log(data);
            res.send(data);
        })
    })

    //serving the get request for searching the user in DB and granting the access
    app.post('/login', function (req, res) {
        console.log(req.body);
        if(req.body.password === 'admin123456' && req.body.login === 'admin'){
            req.session.name = 'admin';
            req.session.surname = '';
            req.session.status = 'admin';
            res.send([{name:'admin',surname:'',status:'admin'}]);
        } else {

        users.find(req.body, { _id: 0, name: 1, surname: 1, status: 1 }, function (err, data) {
            console.log(data)
            if (err) throw err;
            if(data.length){
            req.session.name = data[0].name.charAt(0).toUpperCase() + data[0].name.slice(1); 
            req.session.surname = data[0].surname;
            req.session.status = data[0].status;
            console.log(data);
            res.send(data);
        } else{
            res.send(data);
        }
        })}
    })
    //serving the get request for searching the user in DB 
    app.post('/users/find', function (req, res) {
        console.log(req.body);
        if(req.body.name === ''){delete req.body.name};
        users.find(req.body, { _id: 1, name: 1, surname: 1, status: 1 }, function (err, data) {

            if (err) throw err;
            console.log(data);
            res.send(data);
        })
    })
    //serving the post request for searching the user in DB and updating status --- need to be finished
    app.post('/users/find_update_status', function (req, res) {

        console.log(req.body);

        //if the class of the user is admin, make it user. else - make it admin.
        users.find(req.body, { _id: 1, name: 1, surname: 1, status: 1 }, function (err, data) {

            if (data[0].status === 'guest') {
                users.update(req.body, { $set: { status: 'admin' } }, function (err, inf) {
                    console.log(inf);
                    res.send(inf);
                })
            }
            else {
                users.update(req.body, { $set: { status: 'guest' } }, function (err, inf) {
                    console.log(inf);
                    res.send(inf);
                })
            }


        })


    


    })



    //checking if the system is logged in, and returning session data if it is so
    app.get('/logged', function (req, res) {
        if (req.session.name) {
            res.send(req.session);
        }
        else {
            res.send(null);
        }

    })

    //serving the get request for logout
    app.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            if (err) throw err;
        })

    })

    //serving the get request for managing page
    app.get('/management', function (req, res) {
        if (req.session.name) {
            var fileName = path.join(__dirname + '/../html/Administration page.html');
            res.sendFile(fileName, function (err) {
                if (err) throw err;
            })
        }
        else {
            res.redirect('/');
        }

    })

    //serving the administration - stocks page:
    app.get('/management/stocks', function (req, res) {
        if (req.session.name) {
            fs.readFile(__dirname + '/../html/admin_stocks.html', 'utf8', function (err, data) {
                res.send(data);
            })
        }
        else {
            res.redirect('/');
        }

    })

    //serving the stocks database
    app.get('/management/stocks/db', function (req, res) {
        foodStock.find({}, { _id: 0, q_ty: 1, expires_in: 1, name: 1, units: 1 }, function (err, data) {
            if (err) throw err;
            res.send(data);
        })
    })
    //serving the stocks database partial removal of the items(update)
    // '/management/stocks/db/remove_amount'
    app.post('/management/stocks/db/remove_amount', function (req, res) {
        console.log(req.body);
        var query = { name: req.body.name };
        var rem = +req.body.positionInArray;
        console.log(rem);
        var q_ty_toRemove = {};
        q_ty_toRemove["q_ty." + rem] = 1;
        var expiery_toRemove = {};
        expiery_toRemove["expires_in." + rem] = 1;
        console.log(expiery_toRemove);

        foodStock.update(query, { $unset: q_ty_toRemove }, callback);
        foodStock.update(query, { $unset: expiery_toRemove }, callback);
        foodStock.update(query, { $pull: { q_ty: null, expires_in: null } }, callback);
        function callback(err, data) {
            if (err) throw err;
        }

    })

    //serving the stocks database whole item removal

    // '/management/stocks/db/remove_item'

    app.post('/management/stocks/db/remove_item', function (req, res) {
        console.log(req.body);

        foodStock.deleteOne(req.body, function (err) {
            if (err) throw err;
        })
        res.send('removal is success');

    })

    //serving the stocks database partial adding to the items(update)
    // '/management/stocks/db/add_amount'
    app.post('/management/stocks/db/add_amount', function (req, res) {
        console.log(req.body);
        var query = { name: req.body.name };

        foodStock.update(query, { $push: { q_ty: req.body.q_ty, expires_in: req.body.expires_in } }, callback);

        function callback(err, data) {
            if (err) throw err;
        }
        res.send('true');
    })

    //serving the stocks database item adding
    app.post('/management/stocks/db/add_item', function (req, res) {
        console.log(req.body);

        var newStocksItem = foodStock(req.body).save(function (err, data) {
            if (err) throw err;
            console.log(data);
            res.send(data);
        })

    })

    //serving the orders database item adding
    app.post('/management/orders/db/add_item', function (req, res) {


        //console.log(req.body);

        var newOrdersItem = ordersItem(req.body).save(function (err, data) {
            if (err) throw err;
            console.log(data);
            res.send(data);

        })
        //receiving the order object, and getting the ingredients object from it and updating the db of the stocks

        foodStock.find({}, { _id: 0, name: 1 }, function (err, stock_data) {
            if (err) throw err;
            var recipe = {};
            for (var i = 0; i < stock_data.length; i++) {
                recipe[stock_data[i].name] = 0;
            }

            grillMenuItem.find({}, { _id: 0, name: 1, ingredients: 1 }, function (err, grill_data) {
                if (err) throw err;
                cook(req, grill_data, recipe);
                burgersMenuItem.find({}, { _id: 0, name: 1, ingredients: 1 }, function (err, burger_data) {
                    if (err) throw err;
                    cook(req, burger_data, recipe);
                    //console.log('recipe:', recipe);
                    stocks_update_func(recipe);

                    //recipe is an object with all ingredients per order.

                })

            })

        })

        function cook(request, dbdata, rec) {
            for (food in request.body.items) {
                dbdata.forEach(function (item) {
                    if (food === item.name) {
                        for (ingrid in item.ingredients) {
                            rec[ingrid] = rec[ingrid] + +item.ingredients[ingrid] * +request.body.items[food];
                        }
                    }
                });
            }
        }

        function stocks_update_func(recipe_obj) {

            foodStock.find({}, { _id: 0, name: 1, units: 1, q_ty: 1, expires_in: 1 }, function (err, data) {
                if (err) throw err;
                var update_obj = [];
                for (ingr in recipe_obj) {

                    for (var i = 0; i < data.length; i++) {
                        if (ingr === data[i].name) {

                            while (recipe_obj[ingr] > 0) {
                                var n = 0;
                                var prev = Infinity;
                                for (var j = 0; j < data[i].expires_in.length; j++) {
                                    if (data[i].expires_in[j] < prev && data[i].q_ty[j] > 0) {
                                        var prev = data[i].expires_in[j];
                                        n = j;
                                    }
                                }
                                var ingredients_to_update = "q_ty." + n;
                                var query = { name: ingr };

                                if (recipe_obj[ingr] < data[i].q_ty[n]) {
                                    var rez = +data[i].q_ty[n] - +recipe_obj[ingr];
                                    update_obj.push({ query: query, tool: { [ingredients_to_update]: rez } });
                                    recipe_obj[ingr] = 0;
                                } else {
                                    var rez = 0;
                                    //console.log(ingredients_to_update);
                                    update_obj.push({ query: query, tool: { [ingredients_to_update]: rez } });
                                    recipe_obj[ingr] = recipe_obj[ingr] - +data[i].q_ty[n];
                                }

                            }
                        }
                    }

                }
                console.log(update_obj);
                var counter = 0;
                function updateFunc(update_obj, counter) {
                    console.log('update_obj', update_obj);
                    console.log('counter', counter);
                    if (counter < update_obj.length) {
                        foodStock.update(update_obj[counter].query, { $set: update_obj[counter].tool }, function (err, data) {

                            console.log(data);
                            counter += 1;
                            updateFunc(update_obj, counter);
                        })

                    }
                }
                updateFunc(update_obj, counter);


            });

        }



    })
    //serving the administration - orders page:
    app.get('/management/orders', function (req, res) {
        if (req.session.name) {
            fs.readFile(__dirname + '/../html/admin_orders.html', 'utf8', function (err, data) {
                res.send(data);
            })
        }
        else {
            res.redirect('/');
        }

    })

    //serving the orders database
    app.get('/management/orders/db', function (req, res) {
        ordersItem.find({}, { _id: 0, time: 1, total_amount: 1, total_price: 1, items: 1 }, function (err, data) {
            if (err) throw err;
            res.send(data);
        })
    })


    //serving the administration - finance page:
    app.get('/management/finance', function (req, res) {
        if (req.session.name) {
            fs.readFile(__dirname + '/../html/admin_finance.html', 'utf8', function (err, data) {
                res.send(data);
            })
        }
        else {
            res.redirect('/');
        }

    })
    //serving the administration - users page:
    app.get('/management/users', function (req, res) {
        if (req.session.name) {
            fs.readFile(__dirname + '/../html/admin_users.html', 'utf8', function (err, data) {
                res.send(data);
            })
        }
        else {
            res.redirect('/');
        }

    })

    //serving the users database
    app.get('/management/users/db', function (req, res) {
        users.find({}, { _id: 1, login: 1, mail: 1, name: 1, surname: 1, status: 1 }, function (err, data) {
            if (err) throw err;
            res.send(data);
        })
    })






    //serving the administration - menu page:
    app.get('/management/burger_stocks', function (req, res) {
        if (req.session.name) {
            fs.readFile(__dirname + '/../html/admin_menu.html', 'utf8', function (err, data) {
                res.send(data);
            })
        }
        else {
            res.redirect('/');
        }

    })

    //serving the burgers database
    app.get('/management/burgers/db', function (req, res) {
        burgersMenuItem.find({}, { _id: 0, name: 1, ingredients: 1, info: 1, cost: 1 }, function (err, data) {
            if (err) throw err;
            res.send(data);
        })
    })

    //serving the grill database
    app.get('/management/grill/db', function (req, res) {
        grillMenuItem.find({}, { _id: 0, name: 1, ingredients: 1, info: 1, cost: 1 }, function (err, data) {
            if (err) throw err;
            res.send(data);
        })
    })

    //serving the drinks database/*
    /* app.get('/management/drinks/db', function (req, res) {
       drinkStock.find({}, { _id: 0, name: 1, ingredients: 1, info: 1, cost: 1 }, function (err, data) {
           if (err) throw err;
           res.send(data);
       })
   })*/



    //serving the item removal from the db of the menue
    app.post('/management/db_remove', function (req, res) {
        ///console.log(req.body);
        //grillMenuItem.find(req.body,{_id:0,name:1,ingredients:1,info:1,cost:1},function(err,data){
        //if(err) throw err;
        burgersMenuItem.deleteOne(req.body, function (err) {
            if (err) throw err;
        });
        grillMenuItem.deleteOne(req.body, function (err) {
            if (err) throw err;
        });
        res.send('successfully removed');
        //})  */
    })







    /* There is a handling of the post requests to the DB, what writes the data*/

    app.post('/menu_grill_db_save', function (req, res) {
        console.log(req.body);

        var newMenuItem = grillMenuItem(req.body).save(function (err, data) {
            if (err) throw err;
            console.log(data);
            res.send(data);
        })
    })

    app.post('/menu_burger_db_save', function (req, res) {
        console.log(req.body);

        var newMenuItem = burgersMenuItem(req.body).save(function (err, data) {
            if (err) throw err;
            console.log(data);
            res.send(data);
        })
    })






}


