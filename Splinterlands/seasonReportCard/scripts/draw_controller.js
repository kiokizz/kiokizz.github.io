//Draw Template
//https://github.com/markedjs/marked

function draw_controller() {

  let divider_images = {
    dec: `![](https://cdn.discordapp.com/attachments/736372750385676389/744494310224953405/DEC-divider-new.png)`,
    splinterlands: `![](https://images.hive.blog/p/8SzwQc8j2KJZo6c43w4Bg9ysSuq4sua46yAeUgxyy3WnRJ2vSgsYa6T5u6asHVF6eMYuF9XWYmE755f299tPfJ6JY9Kb1V6xwphPWfm74ma96sejW9c?format=match&mode=fit)`,
    userDefined: ""
  }


  this.draw = function (divider) {
    if (report_array.rental_report_only) drawer.draw_none_gameplay();
    else {
      if (!divider) divider = divider_images.userDefined;
      if (divider_images.userDefined === "") divider = divider_images.dec;

      report_array.custom_title = `${document.getElementById('title').value}`;

      /* Compare API battle count vs sm_battle count:*/
      let template = `## @${report_array.player}

${document.getElementById('textOpening').value}

${divider_images.splinterlands}
### Match Report
#### Performance

${report_array.stats}

${document.getElementById('performance').value}


${divider}${(report_array.matches.Tournament.prize_list.length > 0) ? `\n\n### Tournaments Report\n\n${report_array.matches.Tournament.winnings_table}\n\n${report_array.matches.Tournament.prizes_table}\n${document.getElementById('tournamentResults').value}\n${divider}` : ``}

### Rewards Report
${report_array.earnings.template}

${document.getElementById('textRewards').value}

${divider}${(report_array.dec_balances.rentals.count > 0) ? `\n\n### 🟣 Rental Report\n\n${report_array.rentals_table}\n\n${document.getElementById('rentals').value}\n${divider}` : ``}${(report_array.net_sps > 0) ? `\n\n### ⭐ SPS Report\n\n${report_array.sps_table}\n\n${document.getElementById('sps').value}\n${divider}` : ``}

${document.getElementById('textClosing').value}

---

Posted using SplinterStats Season Report Card ([Website](https://splinterstats.net/seasonReportCard.html)|[Blog](https://www.splintertalk.io/hive-13323/@splinterstats/announcing-splinterstats-season-report-card)).
This once a season tool for [Splinterlands](https://splinterlands.com/?ref=splinterstats) players provides a template to reflect on and share their performance, card usage statistics and rewards summary for the season. More features will be released in the future. 
Follow @splinterstats and come visit us in [Discord](https://discord.com/invite/qFSZX2WGQg) if you have any questions.`;

      report_array.title = `# ${report_array.custom_title}${(report_array.custom_title === ``) ? `` : ` - `}${report_array.static_title}`;
      let post_viewer = `${report_array.title}\n${template}`;
      document.getElementById('content').innerHTML = marked.parse(`${post_viewer}`);
      report_array.report = template;
      // console.log(`${template}`);
    }
  }

  this.draw_none_gameplay = function (divider) {
    if (report_array.matches.Tournament.prize_list.length === 0
        && report_array.dec_balances.rentals.count === 0
        && report_array.sps_balances.airdrop === 0
        && report_array.net_sps === 0) stop_on_error(`There are no tournaments, rental or staking details found. Aborting.`);

      if (!divider) divider = divider_images.userDefined;
    if (divider_images.userDefined === "") divider = divider_images.dec;

    report_array.custom_title = `${document.getElementById('title').value}`;

    let template = `## @${report_array.player}

${document.getElementById('textOpening').value}

${divider}${(report_array.matches.Tournament.prize_list.length > 0) ? `\n\n### Tournaments Report\n\n${report_array.matches.Tournament.winnings_table}\n\n${report_array.matches.Tournament.prizes_table}\n${document.getElementById('tournamentResults').value}\n${divider}` : ``}

${(report_array.dec_balances.rentals.count > 0) ? `\n\n### 🟣 Rental Report\n\n${report_array.rentals_table}\n\n${document.getElementById('rentals').value}\n${divider}` : ``}${(report_array.net_sps > 0) ? `\n\n### ⭐ SPS Report\n\n${report_array.sps_table}\n\n${document.getElementById('sps').value}\n${divider}` : ``}

${document.getElementById('textClosing').value}

---

Posted using SplinterStats Season Report Card ([Website](https://splinterstats.net/seasonReportCard.html)|[Blog](https://www.splintertalk.io/hive-13323/@splinterstats/announcing-splinterstats-season-report-card)).
This once a season tool for [Splinterlands](https://splinterlands.com/?ref=splinterstats) players provides a template to reflect on and share their performance, card usage statistics and rewards summary for the season. More features will be released in the future. 
Follow @splinterstats and come visit us in [Discord](https://discord.com/invite/qFSZX2WGQg) if you have any questions.`;

    report_array.title = `# ${report_array.custom_title}${(report_array.custom_title === ``) ? `` : ` - `}${report_array.static_title}`;
    let post_viewer = `${report_array.title}\n${template}`;
    document.getElementById('content').innerHTML = marked.parse(`${post_viewer}`);
    report_array.report = template;
    // console.log(`${template}`);
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