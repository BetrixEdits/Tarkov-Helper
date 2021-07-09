![Tarkov Helper Banner](src/assets/Media/SecondBanner3000x1000.png)
# Description (This Project Is Not Yet Finished)
**SOME FEATURES ARE NOT COMPLETE**

**Tarkov Helper** is a fully featured Discord bot aimed at giving access to information in Escape From Tarkov in the easiest way

 - Tarkov Helper is using the new Discord Slash Command API so instead of using prefixs, just type `/` and a list of all valid commands will show. [Click Here](https://github.com/BetrixEdits/Tarkov-Helper/wiki/Commands) to see a more detailed explanation of all commands
 
 - Tarkov Helper is not associated with BattleState Games in any way. Any use of Logos refering to Escape From Tarkov or in-game assets are owned by [BattleState Games](https://www.battlestategames.com)
 

# Adding Bot To Server 
**(THE BOT IS CURRENTLY IN DEVELOPMENT) COMING VERY SOON**

# Building Yourself

**Requirements**
- [A code editor](https://code.visualstudio.com/download)
- [Git](https://git-scm.com/downloads) (Optional)
- [Node.js](https://nodejs.org/en/) 

**Setup**
- Download the repository to your project's folder. [**See Here**](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)

 - Create an account on [sheet.best](https://sheet.best) and add connections using [NoFood's Ammo Charts](https://docs.google.com/spreadsheets/d/1jjWcIue0_PCsbLQAiL5VrIulPK8SzM5jjiCMx9zUuvE/edit#gid=64053005) (Optional but make sure to remove all mentions of *GetAmmoData()* and any relating function)

- Create a new Discord bot and make note of its **Bot Token**

 - Add your newly created connection urls to `.env_sample` as well as your Discord bot's token and rename the file to `.env`

- Run the `FirstRun.bat` file or type `npm run first` in the terminal which will download dependencies as well as retrieve necessary game data. The bot should now be running
- To run the bot at other times, run the `StartBot.bat` file
