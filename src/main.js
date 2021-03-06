// Tarkov Data API from Tarkov Tools https://tarkov-tools.com/about/
// Some code snippets are also from Tarkov Tools
async function StartBot(Dev) {
    // Cache data and start the scheduled functions for grabbing data from apis
    require('./command_modules/itemsearchengine')
    require('./command_modules/searchengine').InitSearchEngine()
    require('./command_modules/calibersearchengine').InitCaliberEngine()

    if (!Dev) {
        await require('./tasks').InvokeDatabase()
        require('./tasks').StartTasks()
    }

    require('./bot').InitBot(Dev)

}
StartBot() // Pass in true to use BOT_TOKEN_DEV to log your bot in and bypass waiting for caching