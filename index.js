const { Client, RichEmbed } = require('discord.js');
const fs = require('fs')
const paymentModule = require('iota-payment')

const client = new Client()
const config = JSON.parse(fs.readFileSync('botconfig.json', 'utf8'))
const maxPayoutAmount = config.maxPayoutAmount

client.on('ready', () => {
  console.log(`Bot started as ${client.user.username}`)
})

// functions
var cmds = {
  send,
  donate,
  help,
  balance
}

client.on('message', async msg => {
  try {
    //return if other channel
    if (msg.channel.id != config.channelid) return
    // Getting content, author and channel out of message object
    let cont = msg.content,
      author = msg.author
    //ignore bots
    if (author.bot) return;

    if (cont.startsWith(config.prefix)) {
      let cmd = cont.split(' ')[0].substr(config.prefix.length),
        args = cont.split(' ').slice(1)
      //call function
      if (cmd in cmds) {
        cmds[cmd](msg, args)
      }
    }
  } catch (err) {
    console.log(err)
  }
})

client.login(config.token)

function send(msg, args) {
  if (args[1] > maxPayoutAmount) {
    msg.reply(`payout limit is ${maxPayoutAmount}`)
    return
  }
  let payoutObject = {
    address: args[0],
    value: args[1],
    message: args[2],
    tag: args[3] || 'FAUCETBOT',
    data: { discordid: msg.author.id, channelid: msg.channel.id }
  }
  paymentModule.payout.send(payoutObject)
    .then(payout => {
      msg.reply("payout created, transaction will be sent soon").then(own_msg => own_msg.delete(10000))
    })
    .catch(err => {
      console.log(err);
      msg.reply(JSON.stringify(err))
    })
}

//Create an event handler which is called, when a payout was successfull
let onPayoutSuccess = function (payout) {
  let embed = new RichEmbed()
    .setColor("#17b6d6")
    .setDescription(`Payout sent: [devnet.thetangle.org](https://devnet.thetangle.org/transaction/${payout.txhash})`);
  client.channels.get(payout.data.channelid).send(`<@${payout.data.discordid}>`, embed);
}
paymentModule.on('payoutSent', onPayoutSuccess);

function donate(msg) {
  paymentModule.payment.createPayment({ value: 1 })
    .then(payment => {
      msg.reply("you can send devnet tokens to " + payment.address)
    })
    .catch(err => {
      msg.reply(JSON.stringify(err))
    })
}

function balance(msg) {
  paymentModule.getBalance()
    .then(balance => {
      msg.channel.send("Balance: " + balance)
    })
    .catch(err => {
      msg.reply(JSON.stringify(err))
    })
}

function help(msg) {
  let embed = new RichEmbed()
    .setTitle('Commands:')
    .setColor("#17b6d6")
    .setDescription('help\nbalance\nsend <address amount message tag>\nExample: !send AEG...RHS 1 Hi TRINITY\ndonate //send not needed iotas back\n');
  // Send the embed to the same channel as the message
  msg.channel.send(embed);
}
