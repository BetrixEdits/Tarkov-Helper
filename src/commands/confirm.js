// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'confirm',
            description: 'Use this to command when you have a search pending to finalize a search',
            options: [{
                name: 'position',
                description: 'What item number to confirm the search of',
                required: true,
                type: 3
            }]
        }
    },
    DMCommand: true
}

const Search = require('../command_modules/search')
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')

// Command Functions
const CommandFunction = (args, obj) => {
    let pos = args['position']
    let uid = obj.interaction.member.user.id

    if (Search.OpenSearch(uid)) {
        let Searches = Search.GetSearchObj(uid)

        Search.RemoveSearch(uid)

        return require(`./${Searches.Command}`).CommandFunction({
            item: Searches['Inputs'][pos - 1]
        })
    } else {
        return {
            Type: "Error",
            Content: ErrorMessage('You current don\'t have an open search pending')
        }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings