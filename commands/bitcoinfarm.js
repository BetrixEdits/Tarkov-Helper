// Command Config
const CommandSettings = {
    data: {
        name: 'bitcoinfarm',
        description: 'Calculate the amount of money obtained from a certain amount of Graphics Cards',
        options: [{
                name: 'gpus',
                description: 'Amount of GPUS to calculate with',
                required: true,
                type: 4
            },
            {
                name: "compare-gpus",
                description: 'Use this to display the difference between two different GPU amount',
                required: false,
                type: 4
            }
        ]
    }
}

const { MessageEmbed } = require('discord.js')
const Settings = require('../settings.json')
const { BitcoinFarmCalc } = require('../classes/BitcoinFarmCalc')

// Command Functions

const CommandFunction = (args) => {
    const Calculation = new BitcoinFarmCalc(args['gpus'])

    if (args['compare-gpus'] === undefined) {
        return new MessageEmbed()
            .setColor(Settings.BotSettings['Color'])
            .setTitle('Bitcoin Farm Calculator')
            .setThumbnail(Settings.Images.Thumbnails['BitcoinFarm'])
            .addFields({
                name: "Bitcoin Price",
                value: '₽480,000'
            }, {
                name: "Amount of GPUS",
                value: args['gpus']
            }, {
                name: "Bitcoins Per Day",
                value: Calculation.BTCPerDay
            }, {
                name: "Roubles Per Day",
                value: `₽${Math.round(Calculation.RUBPerDay).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            })
    } else if (args['compare-gpus'] !== undefined) {
        const SecondCalculation = new BitcoinFarmCalc(args['compare-gpus'])

        return new MessageEmbed()
            .setColor(Settings.BotSettings.Color)
            .setTitle('Bitcoin Farm Calculator')
            .setThumbnail(Settings.Images.Thumbnails.BitcoinFarm)
            .addFields({
                name: "Bitcoin Price",
                value: '₽650,000'
            }, {
                name: "Difference in GPUS",
                value: (Math.abs(args['gpus'] - args['compare-gpus']))
            }, {
                name: "Difference in Bitcoins Per Day",
                value: Math.abs(Calculation.BTCPerDay - SecondCalculation.BTCPerDay)
            }, {
                name: "Difference in Roubles Per Day",
                value: `₽${Math.abs((Math.round(Calculation.RUBPerDay) - Math.round(SecondCalculation.RUBPerDay))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            })
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings