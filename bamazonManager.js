//list a set of menu options
//View products for sale: list every item and there IDs,names,prices, and quantities
//View low inventory: list all items with an inventory count lower than five
//Add to inventory display a prompt that will let manager add more of any item in the store
//add a new product allow the manager to add a new product to the store
var mysql = require("mysql");
var inquirer = require("inquirer");
var fs = require("fs");
var idList = [];
var replenishList = []; //array holding items that need to be replenished
// var managerAuth;
var replenishListStock = [];
var currentStock = 0;
var replenish_amount = 0;
var replenish_id = 0;
var insertID = 0;
var insertItem;
var insertDepartment;
var insertPrice = 0;
var insertQuantity = 0;


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
    if (err) throw err;
    start();
});

function start() {
    inquirer.prompt([{
        name: "Manager_Authorization",
        type: "input",
        message: "Enter Manager Auth: "
    }]).then(function(value) {
        var managerAuth = value.Manager_Authorization;
        fs.readFile("ManagerAuth.txt", "utf8", function(err, auth) {
            if (err) throw err;
            if (managerAuth === auth) {
                listOption();
            } else {
                console.log("Authorization Denied")
                start();
            }

        })
    })
}

function listOption() {
    inquirer.prompt([{
        "type": "list",
        "name": "type",
        "choices": ["View Products for Sale", "View Low Inventory", "Add New Product", "Exit"], //if user selected then you will be able to study the cards, if admin is selected then you can create cards
        "message": "What would you like to do?"
    }]).then(function(value) {
        switch (value.type) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory": //addInventory is nested here, this option will show if there are any items that are less than 5
                viewInventory();
                break;
            case "Add New Product": //lets you add new product to the database
                addProduct();
                break;
            case "Exit": //lets you exit the program by terminating the connection
                exit();
                break;
        }
    })
}



function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (i = 0; i < res.length; i++) {
            console.log("**********");
            console.log("ID: " + res[i].item_id);
            console.log("Product: " + res[i].product_name);
            console.log("Price: $" + res[i].price);
            console.log("Quantity in Stock: " + res[i].stock_quantity);
            console.log("**********");
            console.log("");
            idList.push(res[i].item_id);
        }
        inquirer.prompt([{
            "type": "list",
            "name": "type",
            "choices": ["Return to Options"], //if user selected then you will be able to study the cards, if admin is selected then you can create cards
            "message": "Press Enter to Return to Options"
        }]).then(function(value) {
            listOption();
        });
    });
}


function viewInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("");
        console.log("ITEMS IN LOW SUPPLY") //prints out items that have a count of less than 5
        console.log("*********************")
        for (i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log("");
                console.log("----------------------------");
                console.log(res[i].product_name + " " + "in-stock:" + " " + res[i].stock_quantity);
                console.log(res[i].product_name + " " + "ID: " + res[i].item_id);
                console.log("----------------------------");
                console.log("");
            }
        }
        console.log("*********************");
        console.log("");
        inquirer.prompt([{
            "type": "list",
            "name": "type",
            "choices": ["YES", "NO"], //if user selected then you will be able to study the cards, if admin is selected then you can create cards
            "message": "Replenish Items? (This is Recommended) warning: if no items are present, press 'NO' " //if items in low supply is empty, you MUST press NO, this is bug that I am still working on, the rest of the program works
        }]).then(function(value) {
            if (value.type == "YES") {
                addInventory();

            } else {
                listOption();
            }
        });
    });


}

function addInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("");
        console.log("ITEMS IN LOW SUPPLY")
        console.log("*********************")
        for (i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log("");
                console.log("----------------------------");
                console.log(res[i].product_name + " " + "in-stock:" + " " + res[i].stock_quantity);
                console.log(res[i].product_name + " " + "ID: " + res[i].item_id);
                console.log("----------------------------");
                console.log("");

                replenishList.push(res[i].item_id);
                replenishListStock.push(res[i].stock_quantity);
                // console.log(replenishListStock);
            }
        }
        // console.log(replenishListStock);
        // console.log(replenishList);
        console.log("*********************");
        console.log("");

        inquirer.prompt([{
            name: "replenish_ID", //enter the id of the item that you want to replenish
            type: "input",
            message: "Enter the ID of the product you would like to replenish : "
        }]).then(function(value) {
            if (replenishList.length == 0) {
                console.log("EVERYTHING STOCKED"); // if everything is stocked then the user will be redirected to the menu screen
                listOption();
            }
            replenish_id = value.replenish_ID; //use for later when updating the table
            // console.log(replenish_id)
            for (var i = 0 in replenishList) {
                if (value.replenish_ID == replenishList[i]) {
                    inquirer.prompt([{
                        name: "replenish_quantity",
                        type: "input",
                        message: "Enter the enter the number of units to add to item stock: "
                    }]).then(function(value) {
                        // for(var i = 0 in replenishListStock){
                        currentStock = parseInt(replenishListStock[replenishList.indexOf(parseInt(replenish_id))]);


                        replenish_amount = parseInt(value.replenish_quantity) + currentStock;
                        connection.query("UPDATE products SET? WHERE?", [{
                                stock_quantity: replenish_amount
                            }, {
                                item_id: replenish_id
                            }

                        ], function(err, res) {
                            if (err) throw err;
                            listOption();
                        });
                        replenishList = []; //clear both of these arrays
                        replenishListStock = [];
                    });
                    // listOption();




                }
            }
        });

    });

}


function addProduct() {
    console.log("Inserting a new product...\n"); //add products
    inquirer.prompt([{
        name: "insertItem", //since id is set to autoincrement there is no need to enter in a new id
        type: "input",
        message: "Enter the new product name: "
    }]).then(function(value) {
        insertItem = value.insertItem;
        inquirer.prompt([{
            name: "insertDepartment",
            type: "input",
            message: "Enter the new department: "
        }]).then(function(value) {
            insertDepartment = value.insertDepartment;
            inquirer.prompt([{
                name: "insertPrice",
                type: "input",
                message: "Enter the new price: "
            }]).then(function(value) {
                insertPrice = value.insertPrice;
                inquirer.prompt([{
                    name: "insertQuantity",
                    type: "input",
                    message: "Enter the new quantity: "
                }]).then(function(value) {
                    insertQuantity = value.insertQuantity;
                    connection.query(
                        "INSERT INTO products SET ?", {
                            item_id: parseInt(insertID),
                            product_name: insertItem,
                            department_name: insertDepartment,
                            price: parseFloat(insertPrice),
                            stock_quantity: parseInt(insertQuantity),
                        },
                        function(err, res) {
                            var insertID = 0;
                            var insertItem;
                            var insertDepartment;
                            var insertPrice = 0;
                            var insertQuantity = 0;
                            console.log("NEW PRODUCT ADDED");
                            listOption();
                            // console.log(res.affectedRows + " product inserted!\n");
                            // Call updateCrud AFTER the INSERT completes
                            // updateCr/ud();
                        }
                    );




                })
            })
        })
    })


    // 
}




function exit() {
    connection.end();
}
//it in order to update the inventory, first provide a list of the items in low supply
//then inquire the user to enter the id of the product that needs replenishing,
//then inquire the user to enter the amount to replenish by and store that in a variable called replenish
//update from products where?