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

    report_array.custom_title = `${document.getElementById('title').value}`;

    let template = `## @${report_array.player}

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
|Ranked Ratio (Win/Loss+Draw)|${(report_array.matches.Ranked.wins / (report_array.matches.Ranked.loss + report_array.matches.Ranked.draws)).toFixed(2)} (${report_array.matches.Ranked.wins}/${report_array.matches.Ranked.loss}/${report_array.matches.Ranked.draws})|
${(report_array.matches.Tournament.ids.length > 0) ? `|Tournament Ratio (Win/Loss+Draw)|${(!isNaN(report_array.matches.Tournament.wins / (report_array.matches.Tournament.loss + report_array.matches.Tournament.draws)) ? (report_array.matches.Tournament.wins / (report_array.matches.Tournament.loss + report_array.matches.Tournament.draws)).toFixed(2) : 0)} (${report_array.matches.Tournament.wins}/${report_array.matches.Tournament.loss}/${report_array.matches.Tournament.draws})|\n|Tournament Reward Placements|${report_array.matches.Tournament.prize_list.length}/${report_array.matches.Tournament.ids.length}|\n` : ``}|Longest Streak|${report_array.matches.longestStreak}|
|Highest Rated Win *vs*|${report_array.matches.higestRatedOpp.name} (${report_array.matches.higestRatedOpp.rating})|

${document.getElementById('performance').value}

#### Top 10 Summoner Usage

${report_array.matches.summoner_frequency_table}

${document.getElementById('top10summoners').value}

#### Top 100 Monster Usage

${report_array.matches.monster_frequency_table}

${document.getElementById('top100monsters').value}

#### Win Rate by Ruleset

${report_array.matches.ruleset_frequency_table}

${document.getElementById('winratebyruleset').value}

${divider}${(report_array.matches.Tournament.prize_list.length > 0) ? `\n\n### Tournaments Report\n\n${report_array.matches.Tournament.winnings_table}\n\n${report_array.matches.Tournament.prizes_table}\n${document.getElementById('tournamentResults').value}\n${divider}` : ``}

### Rewards Report
${report_array.earnings.template}

${document.getElementById('textRewards').value}

${divider}

${document.getElementById('textClosing').value}

---

Posted using SplinterStats [Season Report Card](https://www.splintertalk.io/hive-13323/@splinterstats/announcing-splinterstats-season-report-card).
This once a season tool for [Splinterlands](https://splinterlands.com/?ref=splinterstats) players provides a template to reflect on and share their performance, card usage statistics and rewards summary for the season. More features will be released in the future. 
Follow @splinterstats and come visit us in [Discord](https://discord.com/invite/qFSZX2WGQg) if you have any questions.`;

    report_array.title = `# ${report_array.custom_title}${(report_array.custom_title === ``) ? `` : ` - `}${report_array.static_title}`;
    let post_viewer = `${report_array.title}\n${template}`;
    document.getElementById('content').innerHTML = marked(`${post_viewer}`);
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