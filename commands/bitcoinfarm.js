const axios = require('axios');


module.exports = {
    name: 'bitcoinfarm',
    description: "Get help with how to use commands. Sytax: !COMMAND {CUSTOM USER INPUT FIELD}",
    async execute(message, args, Discord){
        let getPrice = async () => {
            let response = await axios.get('https://api.coinbase.com/v2/prices/spot?currency=RUB');
            let Price = response.data;
            return Price;
        }
        let PriceValue = await getPrice();
        console.log(PriceValue);

        const newEmbed = new Discord.MessageEmbed()
        .setColor('#cecdc3')
        .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
        .setTitle('Bitcoin Farm Calculator')
        .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/BitcoinFarmLogo200x200.png?token=AMYPLRBCXFTE3RQSFYRYLGC77JSOI')
        .addFields(
            {name: '!BitcoinFarm {AmountOfGPUS}', value: 'Returns the amount of Bitcoins and Roubles made per day from a Bitcoin farm.'}
        )
        message.channel.send(newEmbed);
    }
}