const download = require('download-git-repo')
const schedule = require('node-schedule')
const got = require('got')
const fs = require('fs')

const GetDate = () => {
    return Date().split(' G')[0]
}

const { GetAmmoData } = require('./scripts/nofoodammo')

async function GameData() {
    console.log('Updating Game Data')

    /*

    --> I can just overwrite old files so deleting is useless and could cause issues

    // Get files to be changed
    let Excluded = ['api', 'temp']
    let PendingDirs = fs.readdirSync('./src/game_data/').filter(Name => {
        return !Excluded.includes(Name)
    })
    
    // Delete old files
    try {
        fs.rmSync('./src/game_data/temp/', { recursive: true })
        fs.mkdirSync('./src/game_data/temp/')
    } catch {}

    PendingDirs.forEach(Dir => {
        if (Dir.endsWith('.json')) {
            fs.rmSync(`./src/game_data/${Dir}`)
        } else {
            fs.rmSync(`./src/game_data/${Dir}`, { recursive: true })
        }
    })

    */

    // Download new files
    download('direct:https://github.com/Tarkov-Helper/Database/archive/refs/heads/main.zip', './src/game_data/', function() {
        console.log('Done Updating Game Data')
        return 'Done'
    })
}

// Update game data every hour
const UpdateGameData = schedule.scheduleJob('@hourly', async function() {

    try { await GameData() } catch {}

})

// Update price data every 10 minutes
const UpdatePrices = schedule.scheduleJob('*/10 * * * *', async function() {
    console.log(`{${GetDate()}}: Updating prices`)

    try {
        const bodyQuery = JSON.stringify({
            query: `{
                itemsByType(type: any) {
                    id
                    name
                    shortName
                    avg24hPrice
                    changeLast48h
                    width
                    height
                    imageLink
                    wikiLink
                    basePrice
                    traderPrices {
                        price
                        trader {
                          name
                        }
                    }
                    types
                }
            }`
        })
        const response = await got.post('https://tarkov-tools.com/graphql', {
            body: bodyQuery,
            responseType: 'json',
        })

        let NewPrices = {}

        for (const i in response.body.data.itemsByType) {
            let Item = response.body.data.itemsByType[i]
            Item.PricePerSlot = Math.round(Item.avg24hPrice / (Item.width * Item.height))
            NewPrices[Item.id] = {
                Item
            }
        }

        fs.writeFileSync('./src/game_data/api/pricedata.json', JSON.stringify(NewPrices, null, 4))

        console.log(`{${GetDate()}}: Updated prices successfully`)

    } catch (e) {
        console.log(e)
        console.log(`{${GetDate()}}: Error updating prices, waiting till next cycle`)
    }
})

// Update item data every 12 hours
const UpdateItems = schedule.scheduleJob('@daily', async function() {
    console.log(`{${GetDate()}}: Updating items`)

    const RawGameData = JSON.parse(fs.readFileSync('./src/game_data/raw_game/rawdata.json'))
    const NoFoodTranslator = JSON.parse(fs.readFileSync('./src/game_data/translator.json'))

    try {

        let AmmoData = await GetAmmoData()

        const bodyQuery = JSON.stringify({
            query: `{
            itemsByType(type: any) {
                name
                shortName
                normalizedName
                id
                types
                imageLink
                iconLink
                wikiLink
            }
        }`
        })
        const response = await got.post('https://tarkov-tools.com/graphql', {
            body: bodyQuery,
            responseType: 'json',
        })
        let ApiData = response.body.data.itemsByType

        let ItemData = {}
        let ItemFromID = {}
        let ItemFromName = {}
        let ItemFromShortName = {}
        let ItemIDs = new Array()
        let ItemArray = new Array()

        for (const Item of ApiData) {
            if (Item.name !== undefined) {
                ItemData[Item.id] = {
                    ID: Item.id,
                    Name: Item.name,
                    ShortName: Item.shortName,
                    WikiLink: Item.wikiLink,
                    Types: Item.types,
                    Image: Item.iconLink,
                    RawData: RawGameData[Item.id]
                }
                ItemFromName[Item.name] = {
                    Name: Item.name,
                    ShortName: Item.shortName,
                    ID: Item.id
                }
                ItemFromShortName[Item.shortName.toLowerCase()] = {
                    Name: Item.name,
                    ShortName: Item.shortName,
                    ID: Item.id
                }
                ItemFromID[Item.id] = {
                    Name: Item.name,
                    ShortName: Item.shortName,
                    ID: Item.id
                }
                ItemArray.push(Item.name)
                ItemIDs.push(Item.id)
            }
        }

        // Inject updated ammo data
        for (const Ammo of AmmoData) {
            if (NoFoodTranslator[Ammo.name] !== undefined) {
                let Translated = NoFoodTranslator[Ammo.name]

                if (ItemData[Translated.ID].RawData === undefined) {
                    ItemData[Translated.ID]['RawData'] = {
                        Data: {
                            Damage: Ammo.damage,
                            ArmorDamage: Ammo.armorDamage,
                            PenetrationPower: Ammo.penetration
                        }
                    }
                } else {
                    ItemData[Translated.ID].RawData.Data['Damage'] = Ammo.damage
                    ItemData[Translated.ID].RawData.Data['ArmorDamage'] = Ammo.armorDamage
                    ItemData[Translated.ID].RawData.Data['PenetrationPower'] = Ammo.penetration
                }
            }
        }

        fs.writeFileSync('./src/game_data/api/itemfromshortname.json', JSON.stringify(ItemFromShortName, null, 4))
        fs.writeFileSync('./src/game_data/api/itemfromname.json', JSON.stringify(ItemFromName, null, 4))
        fs.writeFileSync('./src/game_data/api/itemfromid.json', JSON.stringify(ItemFromID, null, 4))
        fs.writeFileSync('./src/game_data/api/itemdata.json', JSON.stringify(ItemData, null, 4))
        fs.writeFileSync('./src/game_data/api/itemarray.json', JSON.stringify(ItemArray, null, 4))
        fs.writeFileSync('./src/game_data/api/itemids.json', JSON.stringify(ItemIDs, null, 4))

        console.log(`{${GetDate()}}: Updated items successfully`)

    } catch (e) {
        console.log(e)
        console.log(`{${GetDate()}}: Error updating items, waiting till next cycle`)
    }

})

// Update quest data every 24 hours
const UpdateQuests = schedule.scheduleJob('@daily', async function() {
    console.log(`{${GetDate()}}: Updating quests`)

    let ExtraData = await got('https://raw.githubusercontent.com/TarkovTracker/tarkovdata/master/quests.json', {
        responseType: 'json',
    })
    ExtraData = ExtraData.body

    try {
        const bodyQuery = JSON.stringify({
            query: `{
                quests {
                    title
                    wikiLink
                    exp
                    giver {
                        name
                    }
                    turnin {
                        name
                    }
                    unlocks
                }
            }`
        })
        const response = await got.post('https://tarkov-tools.com/graphql', {
            body: bodyQuery,
            responseType: 'json',
        })
        let QuestData = response.body.data.quests

        let FormattedData = {}
        for (const Quest in QuestData) {
            FormattedData[QuestData[Quest].title] = QuestData[Quest]
        }

        let QuestNames = new Array()
        for (const Quest in QuestData) {
            QuestNames.push(QuestData[Quest].title)
        }

        for (const Quest of ExtraData) {
            let QuestData = FormattedData[Quest.title]

            try {
                if (Quest.nokappa !== undefined) {
                    QuestData.Kappa = false
                } else {
                    QuestData.Kappa = true
                }
                QuestData.Objectives = Quest.objectives
            } catch {}

        }

        fs.writeFileSync('./src/game_data/api/quests.json', JSON.stringify(FormattedData, null, 4))
        fs.writeFileSync('./src/game_data/api/questnames.json', JSON.stringify(QuestNames, null, 4))

        console.log(`{${GetDate()}}: Updated quests successfully`)

    } catch (e) {
        console.log(e)
        console.log(`{${GetDate()}}: Error updating quests, waiting till next cycle`)
    }

})

// Update quest data every 24 hours
const UpdateBarters = schedule.scheduleJob('@daily', async function() {
    console.log(`{${GetDate()}}: Updating barters`)

    try {
        const bodyQuery = JSON.stringify({
            query: `{
                barters {
                    source
                    requiredItems {
                        count
                        item {
                            name
                            shortName
                            id
                            wikiLink
                        }
                    }
                    rewardItems {
                        count
                        item {
                            name
                            shortName
                            id
                            wikiLink
                        }
                    }
                }
            }`
        })
        const response = await got.post('https://tarkov-tools.com/graphql', {
            body: bodyQuery,
            responseType: 'json',
        })

        let BarterData = response.body.data.barters

        let FormattedData = {}

        for (const Barter of BarterData) {
            let Reward = Barter.rewardItems[0]
            let RewardID = Reward.item.id

            if (FormattedData[RewardID] === undefined) { FormattedData[RewardID] = new Array() }

            let BarterScheme = {
                Trader: Barter.source,
                RequiredItems: new Array(),
                Reward: {
                    Amount: Reward.count,
                    Name: Reward.item.name,
                    ShortName: Reward.item.shortName,
                    ID: RewardID,
                    WikiLink: Reward.item.wikiLink
                }
            }

            for (const Ingredient of Barter.requiredItems) {
                BarterScheme.RequiredItems.push({
                    Amount: Ingredient.count,
                    Name: Ingredient.item.name,
                    ShortName: Ingredient.item.shortName,
                    ID: Ingredient.item.id,
                    WikiLink: Ingredient.item.wikiLink
                })
            }

            FormattedData[RewardID].push(BarterScheme)
        }

        fs.writeFileSync('./src/game_data/api/barters.json', JSON.stringify(FormattedData, null, 4))

        console.log(`{${GetDate()}}: Updated barters successfully`)
    } catch (e) {
        console.log(e)
        console.log(`{${GetDate()}}: Error updating barters, waiting till next cycle`)
    }

})

const StartTasks = async() => {
    try {
        fs.mkdirSync('./src/game_data/api')
    } catch {}

    // Run updates at startup
    UpdatePrices.invoke()
    UpdateItems.invoke()
    UpdateQuests.invoke()
    UpdateBarters.invoke()

    // Start the intervalled updates
    UpdateGameData.schedule()
    UpdatePrices.schedule()
    UpdateItems.schedule()
    UpdateQuests.schedule()
    UpdateBarters.schedule()
}

exports.StartTasks = StartTasks
exports.GameData = GameData