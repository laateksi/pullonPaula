// telegramBot; to help with the daily life

var VowTelegramBot = require('vow-telegram-bot'),
    bot = new VowTelegramBot({
        //your bot token given by the botfather
        token: 'bot token here',
        polling: {
            timeout: 3,
            limit: 100
        }
    });

// request and cheerio for web scraping
var request = require('request');
var cheerio = require('cheerio');

// List of out club members
var toimarit = [
    "Jori",
    "Joonas",
    "Masse",
    "Ville",
    "Burri",
    "Suoraniemi",
    "Antti"
    ]

// Bot waiting for messages
bot.on('message', function(message) {
      var from = message.from;
      var msg = message.text;
      console.log("Viesti oli: "+ msg);
      console.log(from);
      msg = msg.toLowerCase();

      //init the words bot is waiting
      var joku = msg.search('joku');
      var newton = msg.search('newton');
      var fusari = msg.search('fusari');
      var såås = msg.search('såås');
      var hertsi = msg.search('hertsi');
      var reaktori = msg.search('reaktori');
      var rafla = msg.search('ruokaa');


//-----------------------------------------------------------
//Scrape pna
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
})})
