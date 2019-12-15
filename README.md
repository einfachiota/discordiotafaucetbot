# discordiotafaucetbot
A discordbot which can pay out IOTA devnet tokens

Create a `botconfig.json` file and replace the token, you get yours here in the bot section: https://discordapp.com/developers/applications/
```
{
  "token": "srhsjdSRAehhdjztkz.arJrshA.zW_L3jhf_ghtjt",
  "prefix": "!"
}
```

Create a `.env` file and replace the seed 
```
SEED='Replace with 81 Trytes'
IOTANODE='https://nodes.devnet.thetangle.org:443'
FALLBACKNODE='https://nodes.devnet.iota.org:443/'
MAX_PAYMENT_TIME=4320
```
For more infos look at https://github.com/machineeconomy/iota-payment

Install packages: `npm i`

Start the bot: `node index.js`

You can invite the bot to your server with https://discordapp.com/oauth2/authorize?client_id=2938572984604687&scope=bot if you replace the client_id number with yours

Get some initial devnet tokens here https://faucet.devnet.iota.org/

Send `!help` in a channel with the bot to see all available commands
