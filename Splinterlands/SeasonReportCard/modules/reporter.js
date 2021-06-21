function create_reporter(splinterlands) {
  let current_report_title = '';
  let current_report_content = '';

  let divider_images = {
    dec: `![](https://cdn.discordapp.com/attachments/736372750385676389/744494310224953405/DEC-divider-new.png)`,
    splinterlands: `![](https://images.hive.blog/p/8SzwQc8j2KJZo6c43w4Bg9ysSuq4sua46yAeUgxyy3WnRJ2vSgsYa6T5u6as`
      + `HVF6eMYuF9XWYmE755f299tPfJ6JY9Kb1V6xwphPWfm74ma96sejW9c?format=match&mode=fit)`
  }

  async function generate_report(player) {
    let matches = player.matches;
    
    current_report_content = `## @${player.username}

${el('textOpening').value}

${divider_images.splinterlands}
### Match Report
#### Performance

|Stat|#|
|-|-|
|${player.season.league_name} Rank|${player.season.rank}|
|Rating|${player.season.rating} - ${player.season.league}|
|Rating High|${matches.highRating}|
|Total Rating Movements (+-)|${matches.ratingMovement}|
|Ranked Ratio (Win/Loss+Draw)|${(matches.Ranked.wins / (matches.Ranked.loss + matches.Ranked.draws)).toFixed(2)} (${matches.Ranked.wins}/${matches.Ranked.loss}/${matches.Ranked.draws})|
${(matches.Tournament.ids.length > 0) ? `|Tournament Ratio (Win/Loss+Draw)|${(!isNaN(matches.Tournament.wins / (matches.Tournament.loss + matches.Tournament.draws)) ? (matches.Tournament.wins / (matches.Tournament.loss + matches.Tournament.draws)).toFixed(2) : 0)} (${matches.Tournament.wins}/${matches.Tournament.loss}/${matches.Tournament.draws})|\n|Tournament Reward Placements|${matches.Tournament.prize_list.length}/${matches.Tournament.ids.length}|\n` : ``}|Longest Streak|${matches.longestStreak}|
|Highest Rated Win *vs*|${matches.higestRatedOpp.name} (${matches.higestRatedOpp.rating})|

${el('performance').value}

#### Top 10 Summoner Usage

${matches.summoner_frequency_table}

${el('top10summoners').value}

#### Top 100 Monster Usage

${matches.monster_frequency_table}

${el('top100monsters').value}

#### Win Rate by Ruleset

${matches.ruleset_frequency_table}

${el('winratebyruleset').value}

${divider_images.dec}${(matches.Tournament.prize_list.length > 0) ? `\n\n### Tournaments Report\n\n${matches.Tournament.winnings_table}\n\n${matches.Tournament.prizes_table}\n${document.getElementById('tournamentResults').value}\n${divider_images}` : ``}

### Rewards Report
${`matches.earnings.template`}

${el('textRewards').value}

${divider_images.dec}

${el('textClosing').value}

---

Posted using SplinterStats [Season Report Card](https://www.splintertalk.io/hive-13323/@splinterstats/announcing-splinterstats-season-report-card).
This once a season tool for [Splinterlands](https://splinterlands.com/?ref=splinterstats) players provides a template to reflect on and share their performance, card usage statistics and rewards summary for the season. More features will be released in the future. 
Follow @splinterstats and come visit us in [Discord](https://discord.com/invite/qFSZX2WGQg) if you have any questions.`;

    current_report_title = get_report_title(player);
    let current_report = `${current_report_title}\n${current_report_content}`;
    el('content').innerHTML = marked(`${current_report}`);
    throw 'error';
  }

  return {
    generate_report
  };
}

get_report_title = function (season_number) {
  let custom_title = el('title').value.trim() === '' ? el('title').value + ' - ' : '';
  return `${custom_title} Splinter Stats Season ${season_number} Report Card`;
}