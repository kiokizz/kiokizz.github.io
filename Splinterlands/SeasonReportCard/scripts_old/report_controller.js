function report_controller() {
  let context = this;

  let prices = {
    LEGENDARY: 40,
    GOLD: 50,
    MYSTERY: 1200,
    QUEST: 750,
    untamed_pack: 2000,
    essence_orb: 2500,
    decNormBetaBurnRates: {
      1: 15,
      2: 60,
      3: 300,
      4: 1500
    },
    decNormUntamedBurnRates: {
      1: 10,
      2: 40,
      3: 200,
      4: 1000
    },
    cards: {},
    land: 20000
  }

  this.generate = function () {
    document.getElementById('generate').disabled = true;
    add_border('viewer_div');
    report_array.player = `${document.getElementById("username").value}`;
    if (report_array.logInType === `keychainBegin`) context.keychainBegin();
    else if (report_array.logInType === `keyBegin`) context.keyBegin();
    else throw `Error with logInTpye;`
  }

  this.toggleLogin = function () {
    var checkBox = document.getElementById("keyType");
    var passwordField = document.getElementById("password");
    if (checkBox.checked == false) {
      passwordField.style.display = "block";
      report_array.logInType = `keyBegin`;
    } else {
      passwordField.style.display = "none";
      report_array.logInType = `keychainBegin`;
    }
  }

  this.keychainBegin = function () {
    console.log(`Logging in with Hive Keychain.`);
    if (window.hive_keychain) {
      hive_keychain.requestHandshake(function () {
        update_status(`Hive-Keychain Connected`);
        hive_keychain.requestEncodeMessage(
          `${report_array.player}`,
          `splinterstats`,
          `#SplinterStatsReportCard`,
          `Posting`,
          function (response) {
            if (response.success) {
              update_status(`Account Verified`);
              context.getDetails();
            } else stop_on_error(`Please ensure you have the Posting Key for @${report_array.player} in Hive Keychain and refresh the page.`);
          }
        );
      });
    } else stop_on_error(`Please log-in to, or install, Hive Keychain`);
  }

  this.keyBegin = function () {
    console.log("Logging in with private key.");
    report_array.posting_key = `${document.getElementById("password").value}`;
    //encode message
    hive.api.getAccounts([report_array.player], function (err, result) {
      let pubWif = result[0].posting.key_auths[0][0];
      let isvalid;
      //console.log(err, result);
      try {
        isvalid = hive.auth.wifIsValid(report_array.posting_key, pubWif);
      } catch (e) {
        isvalid = 'false';
      }
      if (isvalid == true) {
        update_status(`Posting Key Validated.`);
        context.getDetails();
      } else {
        stop_on_error(`Please ensure you have the Posting Key for @${report_array.player} and refresh the page.`);
      }
    });
  }

  this.getDetails = function () {
    update_status(`Getting Splinterlands settings.`);
    let url = "https://game-api.splinterlands.com/settings";
    request(url, 0, context.seasonNum);
  }

  this.seasonNum = function (data) {
    console.log(data)
    report_array.season.id = data.season.id;
    report_array.season.name = data.season.name;
    report_array.season.nameNum = data.season.name.substring(data.season.name.length - 2, data.season.name.length);
    report_array.season_start = Date.parse(report_array.season.season_end_times[report_array.season.id - 2]);
    report_array.season_end = Date.parse(report_array.season.season_end_times[report_array.season.id - 1]);

    report_array.permlink = `splinterstats-season-${report_array.season.nameNum - 1}-report-card`;
    report_array.static_title = `Splinter Stats Season ${report_array.season.nameNum - 1} Report Card`;

    console.log(`Season: ${report_array.season.nameNum}`);

    var permlink = `splinterstats-season-${report_array.season.nameNum - 1}-report-card`;
    hive.api.getDiscussionsByAuthorBeforeDate(report_array.player, null, new Date().toISOString().split('.')[0], 100, function (err, result) {
      console.log(err, result);
      console.log(permlink);
      result.forEach(post => {
        if (post.permlink == permlink) stop_on_error(`@${report_array.player}'s Season Report has already been posted. Please go to www.splintertalk.io/@${report_array.player}/${permlink}`);
      });

      update_status(`Getting all card details.`);
      request(`https://game-api.splinterlands.com/cards/get_details`, 0, context.allCardsDetails);
    });
  }

  this.allCardsDetails = function (data) {
    update_status(`Sorting card details.`);
    report_array.allCards = data;
    report_array.rewardsCards = {};
    console.log(`All cards:`, data);
    let rarities = {
      1: "common",
      2: "rare",
      3: "epic",
      4: "legendary"
    }
    //Card prices....
    //data = JSON.parse(data);
    let rewardsCards = [];
    data.forEach(e => {
      for (let i = 0; i < data.length; i++) {
        const card = e
        if (card.editions === "3") {
          rewardsCards.push(card);
          report_array.rewardsCards[data[i].id] = data[i];
        }
      }
    });
    // Beta or UNTAMED DEC Burn
    rewardsCards.forEach(e => {
      let c = {}
      if (e.id <= 223) {
        c.edition = "beta"
        c.dec = prices.decNormBetaBurnRates[e.rarity];
      } else {
        c.edition = "untamed";
        c.dec = prices.decNormUntamedBurnRates[e.rarity];
      }
      c.card = e.name;
      c.rarity = rarities[e.rarity];
      c.rarityNum = e.rarity;
      c.id = e.id;
      prices.cards[e.id] = c;
    });

    update_status(`Getting player season records.`);
    request(`https://api2.splinterlands.com/players/season_details?name=${report_array.player}`, 0, context.seasonDetails);
  }

  this.seasonDetails = function (data) {

    let seasonRecord = false;
    console.log(data);
    if (data.error) stop_on_error(data.error);
    data.forEach(e => {
      if (e.season === report_array.season.id - 1) {
        if (e.reward_claim_tx === null) {
          stop_on_error(`Season rewards have not been claimed. Please claim before proceeding. Please refresh the page before proceeding.`);
        }
        seasonRecord = true;
        console.log(`Season data exists.`);
        //TODO Continue from here.
        report_array.matches.guild = e.guild_name;
        report_array.matches.league = rankings[e.league].name;
        report_array.matches.league_name = rankings[e.league].group;
        report_array.matches.rank = e.rank;
        report_array.matches.rating = e.rating;
        report_array.matches.highRating = e.max_rating;
        report_array.matches.longestStreak = e.longest_streak;
        update_status(`Getting player transactions before block: n/a.`);
        request(`https://api.steemmonsters.io/players/history?username=${report_array.player}&from_block=-1&limit=500`, 0, context.playerHistory);
      }
    });
    if (!seasonRecord) {
      stop_on_error(`No records found for season ${report_array.season.nameNum - 1}. ${errMessage}`);
      //ToDo Reset search button.
    }
  }

  //Check if posted already for the previous season.
  //ToDo before initial release

  let xx = 0;

  //Get player history
  this.playerHistory = function (data) {
    console.log(data);
    let before_block;
    let limit = 500;
    data.forEach((e, i) => {
      if (!report_array.tx_types.includes(e.type)) report_array.tx_types.push(e.type);
      if (!report_array.tx_ids.includes(e.id)) {
        report_array.tx_ids.push(e.id);
        report_array.txs.push(e);
      } //else console.log(`${i}: ${e.id}`);
      if (i === data.length - 1) before_block = e.block_num;
    });
    xx++;
    if (limit === data.length) {
      update_status(`Getting player transactions before block: ${before_block}.`);
      request(
        `https://api.steemmonsters.io/players/history?username=${report_array.player}&from_block=-1&before_block=${before_block}&limit=500`,
        0,
        context.playerHistory);
    } else {
      console.log(report_array.tx_types)
      context.sortHistory();
    }
  }

  this.sortHistory = function () {
    //report_array.season.id
    report_array.txs.forEach((tx, i) => {
      update_status(`Sorting transactions: ${i}/${report_array.txs.length}.`);
      let created_date = Date.parse(tx.created_date);
      let valid = false;
      if (created_date > report_array.season_start && created_date < report_array.season_end) valid = true;

      if (tx.type === "claim_reward") {
        let json = JSON.parse(tx.data);
        if (json.type === "league_season" && created_date > report_array.season_end) valid = true;
        else if (json.type === "league_season") valid = false;
      } else if (tx.type === `enter_tournament` && created_date < report_array.season_end) valid = true;
      if (valid) {
        switch (tx.type) {
          case "sm_battle":
            //console.log(tx);
            let json = JSON.parse(tx.result);
            let match_type = json.match_type;
            let win = (json.winner === report_array.player);
            if (match_type === `Ranked`) tally_wdl(match_type);
            else if (match_type === `Tournament`) tally_wdl(match_type);
            else if (match_type === `Practice`) {
              console.log(`Practice Match`);
            } else {
              console.log("unknown match type", tx)
            }

          function tally_wdl(match_type) {
            if (win) {
              report_array.matches[match_type].wins++;
              if (match_type === `Ranked`) report_array.earnings.matches += json.dec_info.reward;
            } else if (json.winner === "DRAW") report_array.matches[match_type].draws++;
            else report_array.matches[match_type].loss++;
          }

            //console.log(`Battle Result Json`, json);
            let rulesets = json.ruleset.split("|");
            rulesets.forEach(ruleset => {
              if (!report_array.matches.rulesets[ruleset]) {
                report_array.matches.rulesets[ruleset] = {
                  name: ruleset,
                  wins: 0,
                  loss: 0,
                  draws: 0,
                  count: 0
                }
              }
              report_array.matches.rulesets[ruleset].count++;
              if (win) {
                report_array.matches.rulesets[ruleset].wins++;
              } else if (json.winner === "DRAW") report_array.matches.rulesets[ruleset].draws++;
              else report_array.matches.rulesets[ruleset].loss++;
            });

            json.players.forEach(player => {
              if (player.name !== report_array.player) {
                report_array.matches.opponents.push(player.name);
                //Highest Rated Opponent
                // TODO change to winning matches only
                if (win) {
                  let oppHighRating = Math.max(player.initial_rating, player.final_rating);
                  if (oppHighRating >= report_array.matches.higestRatedOpp.rating) {
                    if (oppHighRating > report_array.matches.higestRatedOpp.rating) {
                      report_array.matches.higestRatedOpp.name = `@[${player.name}](https://splinterlands.com?p=battle&id=${json.id}&ref=splinterstats)`;
                      report_array.matches.higestRatedOpp.rating = oppHighRating;
                    } else if (!report_array.matches.higestRatedOpp.name.includes(`@${player.name}`)) {
                      report_array.matches.higestRatedOpp.name += ` & @[${player.name}](https://splinterlands.com?p=battle&id=${json.id}&ref=splinterstats)`
                    }
                  }
                }
              } else {
                if (Object.keys(player.team).length !== 0) player.team.win = win;
                report_array.matches.teams.push(player.team);
                report_array.matches.ratingMovement += Math.abs((player.initial_rating - player.final_rating));
              }
            });
            /* ToDO
            Number of Attacks [melee, ranged, magic], Misses / Reflects
            Total Heals, card: {id: `xx-xx-xxxxxx`, healed: ?}
            Generate usage statistics from team data.       
            */
            break;
          case "sm_team_reveal":
            //do somethings
            break;
          case "sm_submit_team":
            //do somethings
            break;
          case "find_match":
            //do somethings
            break;
          case "sm_combine_cards":
            //do somethings
            break;
          case "market_purchase":
            //do somethings
            break;
          case "guild_promote":
            //do somethings
            break;
          case "claim_reward":
            //console.log(`Reward Claim: `, tx);
            let data = JSON.parse(tx.result);

            let reward_json = JSON.parse(tx.data);
            let dailyOrSeason = (reward_json.type === "league_season") ? `season` : `daily`;

            if (data !== null) {
              data.rewards.forEach(chest => {
                report_array.earnings.loot_chests[dailyOrSeason].count++;
                if (chest.type === `potion`) {
                  //console.log(`Loot: ${chest.potion_type} Potion x ${chest.quantity}`);
                  if (chest.potion_type === `legendary`) {
                    report_array.earnings.loot_chests[dailyOrSeason].legendary_potion++;
                  } else if (chest.potion_type === `gold`) {
                    report_array.earnings.loot_chests[dailyOrSeason].alchemy_potion++;
                  }
                } else if (chest.type === `reward_card`) {
                  //console.log(`Loot: ${chest.card.uid} Gold: ${chest.card.gold} x ${chest.quantity}`);
                  let gold = chest.card.gold ? 'gold' : 'stand';
                  report_array.earnings.loot_chests[dailyOrSeason].cards[gold][report_array.rewardsCards[chest.card.card_detail_id].rarity].count++;
                  report_array.earnings.loot_chests[dailyOrSeason].cards[gold].total.count++;
                  report_array.earnings.loot_chests[dailyOrSeason].cards[gold][report_array.rewardsCards[chest.card.card_detail_id].rarity].dec += (chest.card.gold ? prices.cards[chest.card.card_detail_id].dec * 50 : prices.cards[chest.card.card_detail_id].dec);
                  report_array.earnings.loot_chests[dailyOrSeason].cards[gold].total.dec += (chest.card.gold ? prices.cards[chest.card.card_detail_id].dec * 50 : prices.cards[chest.card.card_detail_id].dec);
                  //Use ID to get DEC from prices array
                } else if (chest.type === `dec`) {
                  //console.log(`Loot: ${chest.quantity} DEC`);
                  report_array.earnings.loot_chests[dailyOrSeason].dec += chest.quantity;
                } else if (chest.type === `pack`) {
                  //console.log(`Loot: UNTAMED ${chest.quantity}`);
                  report_array.earnings.loot_chests[dailyOrSeason].untamed_packs++;
                } else {
                  console.log(`Unknown reward type: ${chest.type}`);
                  alert(`Unknown reward type: ${chest.type}`)
                }
              });
            }
            break;
          case "sm_gift_cards":
            //do somethings
            //console.log(`sm_gift_cards....`, tx);
            break;
          case "gift_packs":
            //Need to check for end of season league packs
            //console.log(`gift_packs....`, tx);
            break;
          case "sm_start_quest":
            //do somethings
            break;
          case "enter_tournament":
            //Add to tournament list
            let enter_result = JSON.parse(tx.data);
            report_array.matches.Tournament.ids.push(enter_result.tournament_id);
            break;
          case "leave_tournament":
            //Remove from tournaments list
            let leave_result = JSON.parse(tx.data);
            report_array.matches.Tournament.ids = report_array.matches.Tournament.ids.filter(t => t !== leave_result.tournament_id);
            break;
          case "open_all":
            //do somethings
            break;
          case "sm_refresh_quest":
            //do somethings
            break;
          case "start_match":
            //do somethings
            break;
          case "sm_surrender":
            //do somethings
            break;
          case "undelegate_cards":
            //do somethings
            break;
          case "sm_combine_all":
            //do somethings
            break;
          case "open_pack":
            //do somethings
            break;
          case "claim_airdrop":
            //do somethings
            break;
          case "purchase":
            //do somethings
            break;
          case "token_transfer":
            //do somethings
            break;
          case "delegate_cards":
            //do somethings
            break;
          case "gift_cards":
            //do somethings
            break;
          case "combine_all":
            //do somethings
            break;
          case "combine_cards":
            //do somethings
            break;
          case "guild_remove":
            //do somethings
            break;
          case "guild_invite":
            //do somethings
            break;
          case "guild_accept":
            //do somethings
            break;
          case "sm_pack_purchase":
            //do somethings
            break;
          case "tournament_checkin":
            //do somethings
            break;
          case "sm_decline_challenge":
            //do somethings
            break;
          case "team_reveal":
            //do somethings
            break;
          case "submit_team":
            //do somethings
            break;
          case "start_quest":
            //do somethings
            break;
          case "refresh_quest":
            //do somethings
            break;
          case "mystery_reward":
            //do somethings
            break;
          case "surrender":
            //do somethings
            break;
          default:
            console.log(`Unidentified case! ${tx.type}`, tx)
        }
      }
    });
    if (report_array.matches.Tournament.ids.length > 0) context.tournamentData(0);
    else context.rewardsData();
  }

  this.tournamentData = function (data) {
    if (data === 0) {
      update_status(`Tournament Data`);
      //console.log(`List of tournaments entered by ID:`, report_array.matches.Tournament.ids);
      report_array.matches.Tournament.searchIndex = 0;
    } else {
      report_array.matches.Tournament.data.push(data);
      report_array.matches.Tournament.searchIndex++;
    }
    update_status(`Collecting entered tournament's data.. ${report_array.matches.Tournament.data.length}/${report_array.matches.Tournament.ids.length}`);
    if (report_array.matches.Tournament.searchIndex < report_array.matches.Tournament.ids.length) {
      request(`https://api2.splinterlands.com/tournaments/find?id=${report_array.matches.Tournament.ids[report_array.matches.Tournament.searchIndex]}`,
        0,
        context.tournamentData);
    } else {
      //Sort Data once ready
      console.log(`Tournament Data: (${report_array.matches.Tournament.data.length}/${report_array.matches.Tournament.ids.length})`, report_array.matches.Tournament.data);

      report_array.matches.Tournament.data.forEach((tournament, i) => {
        if (tournament.status === 2) {
          if (report_array.season_end > Date.parse(tournament.rounds[tournament.rounds.length - 1].start_date) + (tournament.data.duration_blocks ? (3000 * tournament.data.duration_blocks) : 0)) {
            for (let player of tournament.players) {
              //TODO accumulate entry fees to list on report
              /* //TODO Add Entry Fees to offset tournament prizes.
              console.log(`Entry fee... ${player.fee_amount}`);
              */
              if (player.player === report_array.player) {
                //Prizes
                tournament.data.prizes.payouts.forEach(group => {
                  if (player.finish >= group.start_place && player.finish <= group.end_place) {
                    add_to_prizeList(player, tournament, group.items)
                  }
                  ;
                });

                // W/L/D
                report_array.matches.Tournament.wins += player.wins;
                report_array.matches.Tournament.loss += player.losses;
                report_array.matches.Tournament.draws += player.draws;
                console.log(`---`);
                break;
              }
            }
          }
        }
      });

      function add_to_prizeList(player, tournament, prizeArray) {
        //Add prize to culmulative earning for tournaments here...
        let ratio = (!isNaN(player.wins / (player.losses + player.draws)) ? (player.wins / (player.losses + player.draws)).toFixed(2) : 0);
        report_array.matches.Tournament.prize_list.push({
          Prize: prizeArray.reduce((string, prize, i) => string += `${(prize.type === `CUSTOM`) ? prize.text : `${prize.qty} ${prize.type}`}${(prizeArray.length > 1 && i < prizeArray.length - 1) ? ` + ` : ``}`, ``),
          Tournament: `${tournament.name}`,
          num_players: `${tournament.num_players}`,
          League: `${rating_level[tournament.data.rating_level]}`,
          Editions: `${(tournament.data.allowed_cards.editions.length === 0 || tournament.data.allowed_cards.editions.length === 6) ? `Open` : `${tournament.data.allowed_cards.editions.reduce((list, ed) => list += editions[ed], ``)}`}`,
          Gold: ``,
          Card_Limits: ``,
          Placement: `${player.finish}`,
          Ratio: `${(ratio.toString() !== `Infinity`) ? ratio : player.wins} (${player.wins}/${player.losses}/${player.draws})`
        });
        // Tally identical prizes:
        prizeArray.forEach(prize => {
          if (prize.type !== `CUSTOM`) report_array.matches.Tournament.prize_tally[prize.type].quantity += prize.qty;
          report_array.matches.Tournament.prize_tally[prize.type].count++;
        });
      }

      console.log(`Prize List`, report_array.matches.Tournament.prize_list);

      let tournament_winnings_table_body = report_array.matches.Tournament.prize_list.reduce((body, row) => body += `|${row.Tournament}|${row.League}|${row.Editions}|${row.Placement}/${row.num_players}|${row.Ratio}|${row.Prize}|\n`, ``)
      report_array.matches.Tournament.winnings_table =
        `### Prizes\n|Tournament|League|Editions|Placement/#entrants|Ratio (Win/Loss+Draw)|Prize|\n|-|-|-|-|-|-|\n${tournament_winnings_table_body}`

      let tournament_winnings_prize_summary_table_body = Object.values(report_array.matches.Tournament.prize_tally).reduce((body, row) => body += `${(row.count > 0) ? `${`|${row.name}|${row.count}|${row.quantity}|\n`}` : ``}`, ``)
      report_array.matches.Tournament.prizes_table =
        `### Summary\n|Reward|Count|Quantity|\n|-|-|-|\n${tournament_winnings_prize_summary_table_body}`

      context.rewardsData();
    }
  }

  this.rewardsData = function () {
    update_status(`Counting Rewards.`);
    let xyz = `xyz`;
    let calc = {};
    //Calculations for Rewards Cards
    //Standard Cards Counts
    calc.stand_common_count = report_array.earnings.loot_chests.daily.cards.stand[1].count + report_array.earnings.loot_chests.season.cards.stand[1].count;
    calc.stand_rare_count = report_array.earnings.loot_chests.daily.cards.stand[2].count + report_array.earnings.loot_chests.season.cards.stand[2].count;
    calc.stand_epic_count = report_array.earnings.loot_chests.daily.cards.stand[3].count + report_array.earnings.loot_chests.season.cards.stand[3].count;
    calc.stand_legendary_count = report_array.earnings.loot_chests.daily.cards.stand[4].count + report_array.earnings.loot_chests.season.cards.stand[4].count;
    //Standard Cards DEC
    calc.stand_common_dec = report_array.earnings.loot_chests.daily.cards.stand[1].dec + report_array.earnings.loot_chests.season.cards.stand[1].dec;
    calc.stand_rare_dec = report_array.earnings.loot_chests.daily.cards.stand[2].dec + report_array.earnings.loot_chests.season.cards.stand[2].dec;
    calc.stand_epic_dec = report_array.earnings.loot_chests.daily.cards.stand[3].dec + report_array.earnings.loot_chests.season.cards.stand[3].dec;
    calc.stand_legendary_dec = report_array.earnings.loot_chests.daily.cards.stand[4].dec + report_array.earnings.loot_chests.season.cards.stand[4].dec;
    //Gold Cards Counts
    calc.gold_common_count = report_array.earnings.loot_chests.daily.cards.gold[1].count + report_array.earnings.loot_chests.season.cards.gold[1].count;
    calc.gold_rare_count = report_array.earnings.loot_chests.daily.cards.gold[2].count + report_array.earnings.loot_chests.season.cards.gold[2].count;
    calc.gold_epic_count = report_array.earnings.loot_chests.daily.cards.gold[3].count + report_array.earnings.loot_chests.season.cards.gold[3].count;
    calc.gold_legendary_count = report_array.earnings.loot_chests.daily.cards.gold[4].count + report_array.earnings.loot_chests.season.cards.gold[4].count;
    //Gold Cards DEC
    calc.gold_common_dec = report_array.earnings.loot_chests.daily.cards.gold[1].dec + report_array.earnings.loot_chests.season.cards.gold[1].dec;
    calc.gold_rare_dec = report_array.earnings.loot_chests.daily.cards.gold[2].dec + report_array.earnings.loot_chests.season.cards.gold[2].dec;
    calc.gold_epic_dec = report_array.earnings.loot_chests.daily.cards.gold[3].dec + report_array.earnings.loot_chests.season.cards.gold[3].dec;
    calc.gold_legendary_dec = report_array.earnings.loot_chests.daily.cards.gold[4].dec + report_array.earnings.loot_chests.season.cards.gold[4].dec;
    //Standard Cards Totals
    calc.total_stand_count = report_array.earnings.loot_chests.daily.cards.stand.total.count + report_array.earnings.loot_chests.season.cards.stand.total.count;
    calc.total_stand_dec = report_array.earnings.loot_chests.daily.cards.stand.total.dec + report_array.earnings.loot_chests.season.cards.stand.total.dec;
    //Gold Cards Totals
    calc.total_gold_count = report_array.earnings.loot_chests.daily.cards.gold.total.count + report_array.earnings.loot_chests.season.cards.gold.total.count;
    calc.total_gold_dec = report_array.earnings.loot_chests.daily.cards.gold.total.dec + report_array.earnings.loot_chests.season.cards.gold.total.dec;
    //Dailies Totals
    calc.total_dailies_count = report_array.earnings.loot_chests.daily.cards.stand.total.count + report_array.earnings.loot_chests.daily.cards.gold.total.count;
    calc.total_dailies_dec = report_array.earnings.loot_chests.daily.cards.stand.total.dec + report_array.earnings.loot_chests.daily.cards.gold.total.dec;
    //Season Totals
    calc.total_season_count = report_array.earnings.loot_chests.season.cards.stand.total.count + report_array.earnings.loot_chests.season.cards.gold.total.count;
    calc.total_season_dec = report_array.earnings.loot_chests.season.cards.stand.total.dec + report_array.earnings.loot_chests.season.cards.gold.total.dec;
    //Cards Total DEC
    calc.total_all_count = calc.total_dailies_count + calc.total_season_count;
    calc.total_all_dec = calc.total_dailies_dec + calc.total_season_dec;

    //Calculations for Packs
    //UNTAMED Packs
    calc.total_untamed_packs_count = report_array.earnings.loot_chests.daily.untamed_packs + report_array.earnings.loot_chests.season.untamed_packs;
    calc.total_untamed_packs_dec = calc.total_untamed_packs_count * prices.untamed_pack;

    //Calculations for Potions
    //Legendary
    calc.total_legendary_potions_count = report_array.earnings.loot_chests.daily.legendary_potion + report_array.earnings.loot_chests.season.legendary_potion;
    calc.total_legendary_potions_dec = calc.total_legendary_potions_count * prices.LEGENDARY;
    //Alchemy
    calc.total_alchemy_potions_count = report_array.earnings.loot_chests.daily.alchemy_potion + report_array.earnings.loot_chests.season.alchemy_potion;
    calc.total_alchemy_potions_dec = calc.total_alchemy_potions_count * prices.GOLD;

    //Calculations for Capture DEC
    report_array.earnings.matches = parseInt(report_array.earnings.matches.toFixed(3));

    //Calculations for Loot Chest DEC
    calc.total_loot_dec = report_array.earnings.loot_chests.daily.dec + report_array.earnings.loot_chests.season.dec;
    calc.total_dec = calc.total_all_dec + calc.total_untamed_packs_dec + calc.total_legendary_potions_dec + calc.total_alchemy_potions_dec + calc.total_loot_dec + report_array.earnings.matches;


    report_array.earnings.template = `##### Standard Foil Cards\n
|Rarity|Quantiy|🔥DEC🔥|
|-|-|-|
|Common|${calc.stand_common_count}|${calc.stand_common_dec}|
|Rare|${calc.stand_rare_count}|${calc.stand_rare_dec}|
|Epic|${calc.stand_epic_count}|${calc.stand_epic_dec}|
|Legendary|${calc.stand_legendary_count}|${calc.stand_legendary_dec}|
|Total Standard|${calc.total_stand_count}|${calc.total_stand_dec}|

##### Gold Foil Cards\n
|Rarity|Quantiy|🔥DEC🔥|
|-|-|-|
|Common|${calc.gold_common_count}|${calc.gold_common_dec}|
|Rare|${calc.gold_rare_count}|${calc.gold_rare_dec}|
|Epic|${calc.gold_epic_count}|${calc.gold_epic_dec}|
|Legendary|${calc.gold_legendary_count}|${calc.gold_legendary_dec}|
|Total Gold|${calc.total_gold_count}|${calc.total_gold_dec}|

#### Loot Chests\n
|Reward Chests|Dailies|Season|Total|💲DEC💲|
|-|-|-|-|-|
|Legendary Potions|${report_array.earnings.loot_chests.daily.legendary_potion}|${report_array.earnings.loot_chests.season.legendary_potion}|${calc.total_legendary_potions_count}|${calc.total_legendary_potions_dec}|
|Alchemy Potions|${report_array.earnings.loot_chests.daily.alchemy_potion}|${report_array.earnings.loot_chests.season.alchemy_potion}|${calc.total_alchemy_potions_count}|${calc.total_alchemy_potions_dec}|
|DEC|${report_array.earnings.loot_chests.daily.dec}|${report_array.earnings.loot_chests.season.dec}|-|${calc.total_loot_dec}|
|UNTAMED Packs|${report_array.earnings.loot_chests.daily.untamed_packs}|${report_array.earnings.loot_chests.season.untamed_packs}|${calc.total_untamed_packs_count}|${calc.total_untamed_packs_dec}|
|Cards (Total)|${calc.total_dailies_count}|${calc.total_season_count}|${calc.total_all_count}|${calc.total_all_dec}|
 
#### Captured DEC (Ranked Rewards)\n
|Ranked Play Wins|DEC Earned|
|-|-|
|${report_array.matches.Ranked.wins}|${report_array.earnings.matches}|

#### Total Ranked Play Rewards\n
|Total Ranked Play Earnings|
|-|
|${calc.total_dec} DEC|`;
    update_status(`Generating card usage statistics.`);
    context.cardUsageData(false);
  }

  this.cardUsageData = function (data) {
    if (!data) {
      report_array.matches.teams.forEach(team => {
        if (Object.keys(team).length !== 0) {
          report_array.matches.teams_fielded++;
          cardCounter(team.summoner, `summoners`, team.win)
          team.monsters.forEach(monster => {
            cardCounter(monster, `monsters`, team.win)
          });
        }

        function cardCounter(card, type, win) {
          let id;
          if (card.substring(0, 7) === `starter`) {
            id = card.split(`-`)[1];
            card = `starter-${id}`;
          }
          if (!report_array.matches.cards.array.includes(card)) report_array.matches.cards.array.push(card);
          if (!report_array.matches.cards[type][card]) {
            report_array.matches.cards[type][card] = {};
            report_array.matches.cards[type][card].identifier = card;
            report_array.matches.cards[type][card].count = 1;
            report_array.matches.cards[type][card].wins = 0;
            //details for phantom cards
            if (card.substring(0, 7) === `starter`) {
              report_array.allCards.forEach(c => {
                if (c.id == id) {
                  report_array.matches.cards[type][card].name = c.name;
                }
                report_array.matches.cards[type][card].id = parseInt(id);
              });
            }
          } else report_array.matches.cards[type][card].count++;
          if (win) {
            report_array.matches.cards[type][card].wins++;
          }
        }
      });

      let cardList = "";
      report_array.matches.cards.array.forEach((card, i) => {
        if (card.substring(0, 7) !== `starter`) {
          cardList += card;
          if (cardList.length > 1 && i !== report_array.matches.cards.array.length - 1) cardList += ",";
        } else {
          if (i === report_array.matches.cards.array.length - 1 && cardList.substring(cardList.length - 1) === ",") cardList = cardList.substring(0, cardList.length - 1);
        }
      });
      request(`https://api.splinterlands.io/cards/find?ids=${cardList}`,
        0,
        context.cardUsageData);
    } else {
      report_array.matches.cards.used_cards_details = data;
      //console.log(`Info on used cards`, data);
      //Assign details
      report_array.matches.cards.used_cards_details.forEach((card, i) => {
        let cardType = `${card.details.type.toLowerCase()}s`;
        report_array.matches.cards[cardType][card.uid].name = card.details.name;
        report_array.matches.cards[cardType][card.uid].id = card.details.id;
      });

      //Check for duplicates
      let toDelete = {};
      checkDuplicates(Object.values(report_array.matches.cards.monsters), `monsters`);
      checkDuplicates(Object.values(report_array.matches.cards.summoners), `summoners`);

      function checkDuplicates(array, type) {
        array.forEach(c1 => {
          array.forEach((c2, i) => {
            if (c1 !== c2 && c1.id === c2.id) {
              if (!toDelete[c1.id]) toDelete[c1.id] = {};
              if (!toDelete[c1.id][c1.identifier]) {
                toDelete[c1.id][c1.identifier] = c1;
                toDelete[c1.id][c1.identifier].type = type;
              }
              if (!toDelete[c2.id][c2.identifier]) {
                toDelete[c2.id][c2.identifier] = c2;
                toDelete[c2.id][c2.identifier].type = type;
              }
            }
          });
        });
      }

      //Combine Duplicates
      Object.values(toDelete).forEach((instructions, i) => {
        let count = 0;
        let newIdentifier = ``;
        let newType = ``;
        let name;
        let id;
        let wins = 0;
        //console.log(`Deletion instructions`, instructions);
        Object.values(instructions).forEach(instance => {
          //console.log(instance);
          count += instance.count;
          wins += instance.wins;
          newIdentifier += `*${instance.identifier}`;
          newType = instance.type;
          name = report_array.matches.cards[instance.type][instance.identifier].name;
          id = report_array.matches.cards[instance.type][instance.identifier].id;
          delete report_array.matches.cards[instance.type][instance.identifier];
        });

        report_array.matches.cards[newType][newIdentifier] = {
          identifier: newIdentifier,
          count: count,
          name: name,
          id: id,
          type: newType,
          wins: wins
        }
      });

      report_array.matches.Ranked.total_matches = report_array.matches.Ranked.wins + report_array.matches.Ranked.loss + report_array.matches.Ranked.draws;
      report_array.matches.Tournament.total_matches = report_array.matches.Tournament.wins + report_array.matches.Tournament.loss + report_array.matches.Tournament.draws;
      report_array.matches.total_matches = report_array.matches.Ranked.total_matches + report_array.matches.Tournament.total_matches;
      report_array.summoner_data = generatePublicDetails(report_array.matches.cards.summoners);
      report_array.monster_data = generatePublicDetails(report_array.matches.cards.monsters);

      //Make percentages.. Top 15 Sums, Top 100 Mons

      function generatePublicDetails(input) {
        let arrayOfCards = Object.values(input);
        arrayOfCards.sort(function (a, b) {
          return b.count - a.count
        });
        console.log(`Sorted Array of Cards: `, arrayOfCards);

        let total = 0;
        arrayOfCards.forEach(card => {
          total += card.count;
        });
        console.log(`Total usage: ${total}`);

        arrayOfCards.forEach(card => {
          card.percent_total = 100 * card.count / total;
          card.percent_matches = 100 * card.count / report_array.matches.teams_fielded;
          card.percent_win = 100 * card.wins / card.count;
        });
        return arrayOfCards;
      }

      //Make table
      report_array.matches.monster_frequency_table = `|Monster|Frequency|Teams Fielded|Win Rate|\n|-|-|-|-|`;
      report_array.monster_data.forEach((card, i) => {
        if (i < 100) {
          report_array.matches.monster_frequency_table = `${report_array.matches.monster_frequency_table}\n|${card.name}|${card.count}|${card.percent_matches.toFixed(2)}%|${card.percent_win.toFixed(2)}%|`;
        }
      });

      report_array.matches.summoner_frequency_table = `|Summoner|Frequency|Teams Fielded|Win Rate|\n|-|-|-|-|`;
      report_array.summoner_data.forEach((card, i) => {
        if (i < 10) {
          report_array.matches.summoner_frequency_table = `${report_array.matches.summoner_frequency_table}\n|${card.name}|${card.count}|${card.percent_matches.toFixed(2)}%|${card.percent_win.toFixed(2)}%|`;
        }
      });
      console.log(`Cards Array`, report_array.matches.cards.array)
      console.log(`Summoners`, report_array.matches.cards.summoners)
      console.log(`Monsters`, report_array.matches.cards.monsters)

      context.rulesetWinRates();
    }
  }

  this.rulesetWinRates = function () {
    let rulesets_array = Object.values(report_array.matches.rulesets);
    rulesets_array.sort(function (a, b) {
      return b.count - a.count
    });
    console.log(`Rulesets`, rulesets_array);
    report_array.matches.ruleset_frequency_table = `|Ruleset|Frequency|Win Rate|\n|-|-|-|`;
    rulesets_array.forEach(ruleset => {
      let total = ruleset.wins + ruleset.loss + ruleset.draws;
      report_array.matches.ruleset_frequency_table = `${report_array.matches.ruleset_frequency_table}\n|${ruleset.name}|${total}|${(100 * ruleset.wins / total).toFixed(2)}%|`
    });

    drawer.draw(); // replace with link to drawer element
    console.log(`Finish`);
    context.enable_text_fields_and_post_button();
  }

  this.enable_text_fields_and_post_button = function () {
    report_array.text_fields.forEach(text_field => {
      document.getElementById(text_field).disabled = false;
      //console.log(`Enabling ${text_field}`);
    });
    if (report_array.matches.Tournament.ids.length > 0) {
      document.getElementById(`tournamentResults`).disabled = false;
      document.getElementById(`tournament`).style.display = "inline";
    }
    document.getElementById('post').disabled = false;
  }
}