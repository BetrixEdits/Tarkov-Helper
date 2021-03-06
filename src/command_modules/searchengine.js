const AccurateSearch = require('accurate-search')
const fs = require('fs')

const ItemFromName = JSON.parse(fs.readFileSync('./src/game_data/api/itemfromname.json'))

let SearchEngine = new AccurateSearch()

function InitEngine() {
    for (const ItemName in ItemFromName) {
        SearchEngine.addText(ItemName, ItemName)
    }
}

const Engine = (Input) => {
    let Results = SearchEngine.search(Input)

    return Results
}

exports.InitSearchEngine = InitEngine
exports.SearchEngine = Engine