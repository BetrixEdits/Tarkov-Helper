![Tarkov Helper Banner](src/assets/Media/SecondBanner3000x1000.png)
![Commands Banner](src/assets/WikiImages/Commands.png)
# Description (This Project Is Not Yet Finished)
**SOME FEATURES ARE NOT COMPLETE**

**Tarkov Helper** is a fully featured Discord bot aimed at giving access to information in Escape From Tarkov in the easiest way

 - Tarkov Helper is using the new Discord Slash Command API so instead of using prefixs, just type `/` and a list of all valid commands will show. [Click Here](https://github.com/BetrixEdits/Tarkov-Helper/wiki/Commands) to see a more detailed explanation of all commands
 
 - Tarkov Helper is not associated with BattleState Games in any way. Any use of Logos refering to Escape From Tarkov or in-game assets are owned by [BattleState Games](https://www.battlestategames.com)
 

# Adding the Bot to Your Server
**Click the invite image to add the bot to your server (CURRENTLY UNAVAILABLE DUE TO THE NOT BEING IN DEVELOPMENT)**
<br>
[<img src="src/assets/Media/InviteScreen.png">]()
<br>
**You can also join the Tarkov Helper Discord Server to try out the bot**
<br>
[<img src="https://discordapp.com/api/guilds/797601083589001227/widget.png?style=banner2">](https://discord.gg/daTPNWes)

# Building Yourself

**Requirements**
- [A code editor](https://code.visualstudio.com/download)
- [Git](https://git-scm.com/downloads) (Optional)
- [Node.js](https://nodejs.org/en/) 

**Setup**
- Download the repository to your project's folder. [**See Here**](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)

- Create a new Discord bot and make note of its **Bot Token**

 - Add your Discord bot's token to `.env` under **BOT_TOKEN** variable

- Run the `FirstRun.bat` file or type `npm run first` in the terminal which will download dependencies as well as retrieve necessary game data. The bot should now be running
- To run the bot at other times, run the `StartBot.bat` file
