// telegramBot; to help with the daily life

//"use strict";

var VowTelegramBot = require('vow-telegram-bot'),
    bot = new VowTelegramBot({
        //your bot token given by the botfather
        token: '199870556:AAH18MW-QI54Mwj13YCfvyyIcMsNsbi_nFo',
        polling: {
            timeout: 3,
            limit: 100
        }
    });

// request and cheerio for web scraping
var request = require('request');
var cheerio = require('cheerio');


//Object
var expenseList = [];
function addExpense(amount, reason) {
    console.log("Lisätään");
    var expense = {
        amount : amount,
        reason : reason
    }
    expenseList.push(expense);
    console.log("Lisättiin:" + amount + " - " + reason);
}

// List of out club members
var toimarit = [
    "Jori",
    "Joonas",
    "Masse",
    "Ville",
    "Burri",
    "Ville2"
    ]

function validateAndAdd(msg) {
    try {
        var parts = msg.split(" ");
        /*
        for (var item in receivedMessage) {
            console.log(receivedMessage[item] + "\n");
        }*/
        //validation
        var partLenght = parts.length; 
        if(partLenght == 2 || partLenght == 3) {
            var number = parseFloat(parts[1]).toFixed(2);
            if (isNaN(number)) {throw "Amount error"
            } else {
                if (parts[2] != undefined) {
                    var selite = parts[2];
                } else { var selite = "null" }
                addExpense(number, selite);
                return "Lisätty"
            }

        } else {
            throw "Syntax:   /lisää <amount> <reason>";
        }
    } catch (err) {
        //return throwed errors
        return err
    }
}

function getExpenses(msg) {

    // TODO: msg wirh different parameters
    try {
        var parts = msg.split(" ");
        if (parts.length > 2) { throw "Syntax: /maksut <param>"
        } else {
            var reply = "Expenses:\n";
            var total = 0;
            if (parts[1] == undefined) {
                var listLenght = expenseList.length; 
                console.log(listLenght);
                if(expenseList.length == 0) { throw "Empty" 
                } else {
                    for (var item in expenseList) {
                        reply = reply + expenseList[item].amount+ " - " + expenseList[item].reason + "\n";
                        var lineAmount = parseFloat(expenseList[item].amount);
                        total = +total + +lineAmount.toFixed(2);
                    }
                }
            } else {
                var searchParam = parts [1];
                for (var item in expenseList) {
                    if (expenseList[item].reason == searchParam) {
                        reply = reply + expenseList[item].amount+ " - " + expenseList[item].reason + "\n";
                        var lineAmount = parseFloat(expenseList[item].amount);
                        total = (+total + +lineAmount).toFixed(2);
                    }
                }
            }
            return reply + "  -- \nTotal: " + total;
        }
    } catch (err) {
        console.log(err);
        return err
    }
}

        /*  
        if(command.length < 2) { throw "Syntaksi"}
                if(command.length > 3) { throw "Syntaksi"}
                var number = expenseList.length +1;
                console.log("Lisätään: " + number);
                console.log(typeof command[1]);
                amount = parseFloat(command[1])
                console.log(typeof amount);
                if(amount = "NaN") { throw "Summan pitää olla luku"
                } else {
                    if(command.length == 3) {
                        var expense = command[2];
                    } else {
                        var expense = " - ";
                    }
                }

                addExpense(amount, expense);*/


// Bot waiting for messages
bot.on('message', function(message) {
      var from = message.from;
      var msg = message.text;
      console.log("Viesti oli: "+ msg);
      console.log(from);
      msg = msg.toLowerCase();

      if(msg[0] == '/') {
        //init the words bot is waiting
        var lisaa = msg.search('/lisää');
        var maksut = msg.search('/maksut');
        var joku = msg.search('joku');
        var newton = msg.search('/newton');
        var fusari = msg.search('/fusari');
        var såås = msg.search('/såås');
        var hertsi = msg.search('/hertsi');
        var reaktori = msg.search('/reaktori');
        var rafla = msg.search('/ruokaa');
        
        if(maksut != -1) {
            try {
               var reply = getExpenses(msg);
                
                bot.sendMessage({
                    chat_id: message.chat.id,
                    text: reply
                })
        } catch(error) {
            console.log(error);
            bot.sendMessage({
                    chat_id: message.chat.id,
                    text: error
                })
        }
        } else if (lisaa != -1){
            try {
                
                var reply = validateAndAdd(msg)
                bot.sendMessage({
                    chat_id: message.chat.id,
                    text: reply
                })
        } catch(error) {
            
            console.log(error);
            bot.sendMessage({
                    chat_id: message.chat.id,
                    text: error
                })
        }
        }
}})


//-----------------------------------------------------------
//Scrape pna
/*
    if(lisaa != -1) {
        try {
        var number = expenseList.length;
        console.log("Lisätään: " + number);
        var toinen = null;
        addExpense(msg, toinen);
        
        bot.sendMessage({
            chat_id: message.chat.id,
            text: number
        })
        }
    catch(error) {console.log(error);}
      }

    if(maksut != -1) {
        
        var viesti = "";
        for (var item in expenseList) {
            viesti = (expenseList[item].amount+ " - " + expenseList[item].expense + "\n");
        }
        
        bot.sendMessage({
            chat_id: message.chat.id,
            text: viesti
        })
      }

var day = new Date();
    var CurrentDay = day.getDay(); 
    url = 'http://www.pna.fi/tty/'+ CurrentDay + '.html?' ;

    request(url, function (error, response, html) {
    if (!error) {
    
        var $ = cheerio.load(html);
        var menu;
        var restaurant = [];


        $('.food').filter(function(){
            var data = $(this);
            menu = data.children().text();
            //console.log(menu);
            //console.log(menu.length);
            restaurant.push(menu);
        })
//----------------------------------------------------------------
// if message was about food -> answer restaurant menu for today
    if(rafla != -1) {
          console.log("--------------------------")
          console.log(restaurant[0]);
          bot.sendMessage({
            chat_id: message.chat.id,
            text: "Newton: \n" +restaurant[0] + "\n" + " -- " + "\n" +
                    "Såås: \n" +restaurant[1] + "\n" + " -- " + "\n" +
                    "Hertsi: \n" +restaurant[2] + "\n" + " -- " + "\n" +
                    "Reaktori: \n" +restaurant[3] + "\n" + " -- " + "\n" +
                    "Fuusion: \n" +restaurant[4]
          })
      }

      if(newton != -1) {
          console.log("--------------------------")
          console.log(restaurant[0]);
          bot.sendMessage({
            chat_id: message.chat.id,
            text: "Newton: \n" +restaurant[0]
          })
      }
      if(fusari != -1) {
          console.log("--------------------------")
          bot.sendMessage({
            chat_id: message.chat.id,
            text: "Fyyysion: \n" +restaurant[4]
          })
      }
      if(såås != -1) {
          console.log("--------------------------")
          bot.sendMessage({
            chat_id: message.chat.id,
            text: "SååsBar: \n" + restaurant[1]
          })
      }
      if(hertsi != -1) {
          console.log("--------------------------")
          bot.sendMessage({
            chat_id: message.chat.id,
            text: "Hertsi: \n" + restaurant[2]
          })
      }
      if(reaktori != -1) {
          console.log("--------------------------")
          bot.sendMessage({
            chat_id: message.chat.id,
            text: "Reaktori: \n" + restaurant[3]
          })
      }
// -----------------------------------------------------------------
// if message was 'joku' determine who is going to do the chores


      if(joku != -1) {
          var num = Math.floor(Math.random() * 6); //return num between 0-10

          bot.sendMessage({
            chat_id: message.chat.id,
            text: "Hetkinen, hetkinen... joku eli " + toimarit[num]
          })
        }
    }
})})*/
