//Draw Template
//https://github.com/markedjs/marked

function draw_controller() {

  let divider_images = {
    dec: `![](https://cdn.discordapp.com/attachments/736372750385676389/744494310224953405/DEC-divider-new.png)`,
    splinterlands: `![](https://images.hive.blog/p/8SzwQc8j2KJZo6c43w4Bg9ysSuq4sua46yAeUgxyy3WnRJ2vSgsYa6T5u6asHVF6eMYuF9XWYmE755f299tPfJ6JY9Kb1V6xwphPWfm74ma96sejW9c?format=match&mode=fit)`,
    userDefined: ""
  }


  this.draw = function (divider) {
    if (!divider) divider = divider_images.userDefined;
    if (divider_images.userDefined === "") divider = divider_images.dec;

    let template = `# SplinterStats Season ${report_array.season.nameNum - 1} Report Card
## @${report_array.player}

${document.getElementById('textOpening').value}

${divider_images.splinterlands}
### Match Report
#### Performance

|Stat|#|
|-|-|
|${report_array.matches.league_name} Rank|${report_array.matches.rank}|
|Rating|${report_array.matches.rating} - ${report_array.matches.league}|
|Rating High|${report_array.matches.highRating}|
|Total Rating Movements (+-)|${report_array.matches.ratingMovement}|
|Ranked Ratio (Win/Loss+Draw)|${(report_array.matches.Ranked.wins / report_array.matches.Ranked.loss).toFixed(2)} (${report_array.matches.Ranked.wins}/${report_array.matches.Ranked.loss}/${report_array.matches.Ranked.draws})|
|Tournament Ratio (Win/Loss+Draw)|${(report_array.matches.Tournament.wins / report_array.matches.Tournament.loss).toFixed(2)} (${report_array.matches.Tournament.wins}/${report_array.matches.Tournament.loss}/${report_array.matches.Tournament.draws})|
|Longest Streak|${report_array.matches.longestStreak}|
|Highest Rated Win *vs*|${report_array.matches.higestRatedOpp.name} (${report_array.matches.higestRatedOpp.rating})|

${document.getElementById('performance').value}

#### Top 10 Summoner Usage

${report_array.matches.summoner_frequency_table}

${document.getElementById('top10summoners').value}

#### Top 100 Monster Usage

${report_array.matches.monster_frequency_table}

${document.getElementById('top100monsters').value}

${divider}

### Rewards Report
${report_array.earnings.template}

${document.getElementById('textRewards').value}

${divider}

${document.getElementById('textClosing').value}`;

    document.getElementById('content').innerHTML = marked(`${template}`);
    report_array.report = template;
    //console.log(`${template}`);
  }
}

//Optionals - change divider, insert giveaway..
/*
let forTemplate = `

### Tournament Report
${document.getElementById('textTournaments').value}
${divider}

### Cards Report
#### Combines
#### Burns
#### Bought
#### Sold
${document.getElementById('textCardStats').value}
${divider}
### Mystery Potion Report
${document.getElementById('textMysteryPotions').value}
${divider}
### Giveaway's
${document.getElementById('textGiveaways').value}
``
*/