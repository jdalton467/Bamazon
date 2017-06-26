//establish a connection to the database//
//once connection is established start the program//
//display the products for sale to the customer//
//prompt the user of the of the id of the product that they would like to buy and then ask how
//many units of the item they would like to buy
//once the customer has placed the order, check to see if there is enough of the item to meet the request
//if not, log insufficient quantity
//if the store does have enough of the product then, update the database table to reflect change
//once the update goes through show the customer the total cost of the purchase
// prompt if they are ok, if yes log "thank you for shopping with us!" and re direct them to the starting screen
//if not, log please come back again and re insert the items back to the table 


var mysql = require("mysql");
var inquirer = require("inquirer");
productsStock = [];
var shoppingCart = []; // will hold an array of objects 
// create the connection information for the sql database
var newStock;
var total = 0;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "$LMPH%",
    database: "bamazon"

});

connection.connect(function(err) {
    if (err) throw err; //throw stops the program from executing
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                for (i = 0; i < res.length; i++) {
                    console.log("**********");
                    console.log("ID: " + res[i].item_id);
                    console.log("Product: " + res[i].product_name);
                    console.log("Price: $" + res[i].price);
                    console.log("**********");
                    console.log("");
                    productsStock.push(res[i].item_id);
                }

                inquirer.prompt([{
                    "type": "list",
                    "name": "type",
                    "choices": ["YES", "NO"], //if user selected then you will be able to study the cards, if admin is selected then you can create cards
                    "message": "Welcome to Bamazon! Would you like to shop?"
                }]).then(function(value) {
                    if (value.type == "YES") {
                        startBuy();
                    }
                    else{
                    	console.log("Come back anytime!");
                    	connection.end();
                    }
              
                });

            });
         }

            function startBuy() {
                // total = 0;
                inquirer.prompt([{
                    name: "item_id",
                    type: "input",
                    message: "Enter the ID of the product you would like to purchase"
                }]).then(function(value) {
                    var idIndex = (parseInt(value.item_id) - 1); // used to grab the stockquantity
                    var id = value.item_id // used later for the shoppingCart object
                    if (isNaN(parseInt(value.item_id)) === false && parseInt(value.item_id) >= 1 && parseInt(value.item_id) <= parseInt(productsStock.length + 1)) {
                        inquirer.prompt([{
                            name: "item_quantity",
                            type: "input",
                            message: "Enter the quantity of the product you would like to purchase"
                        }]).then(function(value) {
                            connection.query("SELECT * FROM products", function(err, res) {
                                if (err) throw err;
                                // Log all results of the SELECT statement
                                // console.log(res[idIndex].stock_quantity);
                                var price = parseInt(res[idIndex].price);
                                var item = res[idIndex].product_name;
                                newStock = res[idIndex].stock_quantity - value.item_quantity; //setting the new inventory

                                if (res[idIndex].stock_quantity > value.item_quantity) {

                                    id = {
                                        id: id,
                                        price: price,
                                        quantity: value.item_quantity
                                    }; //push our selected item and set as a key in the shoppingCart object, with a value of the quantity
                                    shoppingCart.push(id);
                                    // console.log(shoppingCart);
                                    // console.log(shoppingCart[0].id)
                                    console.log("--------------------------------------------------");
                                    console.log("| " + value.item_quantity + " " + item + " added to your Shopping Cart");
                                    updateInventory(); //once items are added to shopping cart, update the inventory
                                } else {
                                    console.log("insufficient quantity");
                                    startBuy();
                                }
                            });

                        })
                    } else {
                        startBuy();
                    }
                })

            }




            function updateInventory() {
                for (var i = 0 in shoppingCart) {
                    connection.query("UPDATE products SET? WHERE?", [{
                                stock_quantity: newStock
                            }, {
                                item_id: shoppingCart[i].id
                            }

                        ],
                        function(err, res) {
                            // console.log(res);
                            for (i = 0; i < shoppingCart.length; i++) {
                                total = total + (shoppingCart[i].price * shoppingCart[i].quantity);
                            }
                            console.log("| Your current total: $" + total);    
                            console.log("--------------------------------------------------");
                            console.log("");
                            shoppingCart = [];
                            checkOut();
                        }
                    );
                }
            }

            function checkOut() {
                inquirer.prompt([{
                    "type": "list",
                    "name": "type",
                    "choices": ["YES", "NO"], //if user selected then you will be able to study the cards, if admin is selected then you can create cards
                    "message": "Would you like to continue shopping?:"
                }]).then(function(value) {
                    if (value.type == "YES") {
                        startBuy();
                    } else {
                        console.log("Final Total: $" + total);
                        console.log("Thank you for shopping with us!");
                        connection.end();


                    }
                })
            }