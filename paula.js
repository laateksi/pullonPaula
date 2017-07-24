// telegramBot; to help with the daily life

//"use strict";
//Auth Ids
var LauriId = 151674286;
var tokenId = '199870556:AAH18MW-QI54Mwj13YCfvyyIcMsNsbi_nFo';

var VowTelegramBot = require('vow-telegram-bot'),
    bot = new VowTelegramBot({
        //your bot token given by the botfather
        token: tokenId,
        polling: {
            timeout: 3,
            limit: 100
        }
    });

// request and cheerio for web scraping
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

//Expenses properties
var expenseList = [];
function addExpense(amount, reason) {
    console.log("Lisätään");
    var moment = new Date();
    moment = "<" + moment.getUTCFullYear() + "/" + moment.getUTCMonth() + "/" +  
                   moment.getUTCDate() + " - " + moment.getUTCHours() + ":" + 
                   moment.getUTCMinutes() + ":" + moment.getUTCSeconds() + ">";
    var expense = {
        moment : moment,
        amount : amount,
        reason : reason
    }
    try {
    //empty expenses
        expenseList.push(expense);
        //fs.appendFile(month + ".json", JSON.stringify(expenseList));
        
    } catch (err) { return err}
}

//Notes
var noteList = [];
function addNote(note) 
{
    var noteParts = note.split(" ");
    var finalNote = "";
    for (var item in noteParts) {
        if (noteParts[item] == noteParts[0]) {}
        else {finalNote = finalNote + noteParts[item] + " "}
    }
    noteList.push(finalNote);
    console.log("lisätty listaan");
}

var commands = [
    "apua - Show list of available commands",
    "lisää - /lisää <amount> <reason>",
    "maksut - /maksut <param>",
    "listaa",
    "note",
    "tyhjennä",
    "joku",
    "newton",
    "fusari",
    "såås",
    "hertsi",
    "reaktori",
    "raflat"
]
// List of out club members
var toimarit = [
    "Jori",
    "Joonas",
    "Masse",
    "Ville",
    "Konsta",
    "Miro",
    "Antti",
    "Mikko",
    "Burri",
    "Takapää Ville"
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

function readFile(parameter) {
    if (parameter.includes("maksut")) {
        fs.readFile("maksut.txt", 'utf8', (err, data) => {
            if (err) throw err;
            console.log(data);
            console.log(typeof data);
            var maksutText = JSON.parse(data);
            console.log("----");
            console.log(maksutText);
            console.log(typeof maksutText);
            console.log("-----------"+ maksutText.amount);
        });
        
    
    }
}

function authentication(Id) {
    if (Id == LauriId) {
        return true
    } else { return false}
}

function getExpenses(msg) {

    // TODO: msg wirh different parameters
    try {
        var parts = msg.split(" ");
        if (parts.length > 2) { throw "Syntax: /maksut <param>"
        } else {
            if(expenseList.length == 0) { throw "Empty" }//readFile(parts[0]);
            var reply = "Expenses:\n";
            var total = 0;
            if (parts[1] == undefined) {
                for (var item in expenseList) {
                    reply = reply + expenseList[item].moment + "    " + expenseList[item].amount+ " - " + expenseList[item].reason + "\n";
                    var lineAmount = parseFloat(expenseList[item].amount);
                    total = +total + +lineAmount.toFixed(2);
                }
            } else {
                var searchParam = parts [1];
                for (var item in expenseList) {
                    if (expenseList[item].reason == searchParam) {
                        reply = reply + expenseList[item].moment + "    " + expenseList[item].amount+ " - " + expenseList[item].reason + "\n";
                        var lineAmount = parseFloat(expenseList[item].amount);
                        total = (+total + +lineAmount).toFixed(2);
                    }
                }
            }
            return reply + "  -- \nTotal: " + total.toFixed(2);
        }
    } catch (err) {
        console.log(err);
        return err
    }
}

function getNotes() 
{
    var replyNote = "";
    for (var item in noteList) {
        replyNote = replyNote + noteList[item] + "\n";
    }
    return replyNote;
}

function tyhjaa () 
{
    while(noteList.length) { noteList.pop();  }   
    return "Tyhjennetty"
}
// Bot waiting for messages
bot.on('message', function(message) {
      var from = message.from;
      var msg = message.text;
      console.log("Viesti oli: "+ msg);
      console.log(from);
      console.log(message.chat);
      console.log(message.chat.id);
      msg = msg.toLowerCase();

      var joku = msg.search('joku');
      if(joku != -1) {
            var num = Math.floor(Math.random() * 6); //return num between 0-10

            bot.sendMessage({
                chat_id: message.chat.id,
                text: "Hetkinen, hetkinen... joku eli " + toimarit[num]
            })
      }
      
      else if(msg[0] == '/') {
        //init the words bot is waiting
        var tyhjenna = msg.search("/tyhjennä");
        var listaa = msg.search("/listaa");
        var note = msg.search("/note");
        var apua = msg.search("/apua");
        var lisaa = msg.search('/lisää');
        var maksut = msg.search('/maksut');
        var newton = msg.search('/newton');
        var fusari = msg.search('/fusari');
        var såås = msg.search('/såås');
        var hertsi = msg.search('/hertsi');
        var reaktori = msg.search('/reaktori');
        var rafla = msg.search('/ruokaa');
        
            if(note != -1) {
                try {
                    if (!authentication(message.chat.id)) {throw "Auth error"}
                    
                    addNote(msg);
                    
                } catch(error) {
                    console.log(error);
                    bot.sendMessage({
                        chat_id: message.chat.id,
                        text: error
                    })
                }
            }

            if(tyhjenna != -1) {
                try {
                    if (!authentication(message.chat.id)) {throw "Auth error"}
                    
                    var reply = tyhjaa();
                    bot.sendMessage({
                        chat_id: message.chat.id,
                        text: reply
                    })

                } catch(error) {
                    console.log(error);
                    bot.sendMessage({
                        chat_id: message.chat.id,
                        text: "Lista Tyhjennetty"
                    })
                }
            }

            if(listaa != -1) {
                try {
                    if (!authentication(message.chat.id)) {throw "Auth error"}
                    var reply = getNotes(msg);
                    
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

            if(maksut != -1) {
                try {
                    if (!authentication(message.chat.id)) {throw "Auth error"}
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
                    if (!authentication(message.chat.id)) {throw "Auth error"}
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
                //List all available commands
            } else if (apua != -1) {
                var reply = "Paula:\n";
                for (var item in commands) {
                    reply = reply + commands[item] + "\n";
                }
                bot.sendMessage({
                    chat_id: message.chat.id,
                    text: reply
                })
        }
    }
})


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
})})*/
