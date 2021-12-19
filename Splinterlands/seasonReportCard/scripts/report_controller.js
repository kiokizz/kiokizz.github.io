function report_controller() {
  let el = id => document.getElementById(id);

  let context = this;
  let testing = false;

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
    decNormChaosBurnRates: {
      1: 5,
      2: 20,
      3: 100,
      4: 500
    },
    cards: {},
    land: 20000
  }

  this.generate = function () {
    el('generate').disabled = true;
    add_border('viewer_div');
    report_array.player = `${el("username").value}`;
    if (testing) {
      update_status(`Account Check Bypassed!! Reason: Testing`);
      context.getDetails();
    } else if (report_array.logInType === `keychainBegin`) context.keychainBegin();
    else if (report_array.logInType === `keyBegin`) context.keyBegin();
    else throw `Error with logInTpye;`
  }

  this.toggleLogin = function () {
    let checkBox = el("keyType");
    let passwordField = el("password");
    if (!checkBox.checked) {
      passwordField.style.display = "block";
      report_array.logInType = `keyBegin`;
    } else {
      passwordField.style.display = "none";
      report_array.logInType = `keychainBegin`;
    }
  }

  this.getTime = function () {
    return new Date().getTime()
  }

  this.keychainBegin = function () {
    console.log(`Loggin in with Hive Keychain.`);
    if (window.hive_keychain) {
      report_array.timeString = context.getTime();
      console.log(report_array.timeString);
      hive_keychain.requestHandshake(function () {
        update_status(`Hive-Keychain Connected`);
        hive_keychain.requestSignBuffer(
            `${report_array.player}`,
            `${report_array.player}${report_array.timeString}`,
            `Posting`,
            function (response) {
              console.log(response);
              report_array.signature = response.result;
              if (response.success) {
                update_status(`Account Verified`);
                context.getDetails();
              } else stop_on_error(`Please ensure you have the Posting Key for @${report_array.player} in Hive Keychain and refresh the page.`);
            },
            null,
            `Splinterlands Login`
        );
      });
    } else stop_on_error(`Please log-in to, or install, Hive Keychain`);
  }

  this.keyBegin = function () {
    console.log("Logging in with private key.");
    report_array.posting_key = `${el("password").value}`;
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
      if (isvalid) {
        report_array.timeString = context.getTime();
        report_array.signature = eosjs_ecc.sign(report_array.player + report_array.timeString, report_array.posting_key);
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
        if (post.permlink === permlink && !testing) stop_on_error(`@${report_array.player}'s Season Report has already been posted. Please go to www.splintertalk.io/@${report_array.player}/${permlink}`);
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
      } else if (e.id < 331) {
        c.edition = "untamed";
        c.dec = prices.decNormUntamedBurnRates[e.rarity];
      } else {
        c.edition = "chaos";
        c.dec = prices.decNormChaosBurnRates[e.rarity];
      }
      c.card = e.name;
      c.rarity = rarities[e.rarity];
      c.rarityNum = e.rarity;
      c.id = e.id;
      prices.cards[e.id] = c;
    });

    update_status(`Getting player season records.`);
    request(`https://api2.splinterlands.com/players/login?name=${report_array.player}&ts=${report_array.timeString}&sig=${report_array.signature}`, 0, context.logIn);
  }

  this.logIn = function (data) {
    console.log(data);
    report_array.token = data.token;

    // TODO possibly put this in a different spot. Added while testing for Season Rewards.
    report_array.season_number_count = 0;

    // request(`https://api2.splinterlands.com/players/leaderboard_with_player?season=${report_array.season.id - 1}&token=${report_array.token}&username=${report_array.player}&leaderboard=${report_array.season_number_count++}&season_details=true`, 0, context.lastSeason)
    // request(`https://api2.splinterlands.com/players/details?name=${report_array.player}&season_details=true&season=${report_array.season.id - 1}`, 0, context.lastSeason)
    request(`https://cache-api.splinterlands.com/players/leaderboard_with_player?season=${report_array.season.id - 1}&username=${report_array.player}`, 0, context.lastSeason)
  }

  this.lastSeason = function (data) {
    console.log(data);
    let season_details = data.player;
    if (data.error) stop_on_error(data.error);

    if (season_details === null) {
      stop_on_error(`No player records found for the previous season.`)
    } else if (season_details.season !== report_array.season.id - 1) {
      console.log(season_details);
      stop_on_error(`Incorrect Season Data.`)
    } else {
      if (season_details.reward_claim_tx === null) {
        stop_on_error(`Season rewards have not been claimed. Please claim before proceeding. Please refresh the page before proceeding.`);
      }
      console.log(`Season data exists.`);
      //TODO Continue from here.
      report_array.matches.guild = season_details.guild_name;
      report_array.matches.league = rankings[season_details.league].name;
      report_array.matches.league_name = rankings[season_details.league].group;
      report_array.matches.rank = season_details.rank;
      report_array.matches.rating = season_details.rating;
      report_array.matches.highRating = season_details.max_rating;
      report_array.matches.longestStreak = season_details.longest_streak;
      report_array.matches.api_battles_count = season_details.battles;
      report_array.matches.api_wins_count = season_details.wins;
      report_array.matches.api_loss_count = report_array.matches.api_battles_count - report_array.matches.api_wins_count;
      report_array.matches.api_draw_count = `n/a`;
      update_status(`Getting player transactions before block: n/a.`);
      report_array.general_query_types = `&types=market_purchase,market_sale,gift_packs,card_award,claim_reward,sm_battle,enter_tournament,leave_tournament,token_transfer`
      request(`https://api.steemmonsters.io/players/history?username=${report_array.player}&from_block=-1&limit=500${report_array.general_query_types}`, 0, context.playerHistory);
    }
  }

  //Get player general Transaction history
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
    if (limit === data.length) {
      update_status(`Getting player transactions before block: ${before_block}.`);
      request(
          `https://api.steemmonsters.io/players/history?username=${report_array.player}&from_block=-1&before_block=${before_block}&limit=500${report_array.general_query_types}`,
          0,
          context.playerHistory);
    } else {
      console.log(report_array.tx_types)
      report_array.dec_query_types = `&types=rental_payment_fees,market_rental,rental_payment,rental_refund,leaderboard_prizes,dec_reward`;
      request(`https://api2.splinterlands.com/players/balance_history?token_type=DEC&offset=0&limit=${limit}&username=${report_array.player}${report_array.dec_query_types}`, 0, context.playerDECBalanceHistory);
    }
  }

  //Get player DEC history
  this.playerDECBalanceHistory = function (data) {
    //console.log(data);
    let offset = 0;
    let limit = 500;
    data.forEach((e) => {
      if (!report_array.dec_transfer_types.includes(e.type)) report_array.dec_transfer_types.push(e.type);
      if (!report_array.dec_transfers.includes(e)) {
        report_array.dec_transfer_ids.push(e.trx_id);
        report_array.dec_transfers.push(e);
      } //else console.log(`${i}: ${e.id}`);
    });
    //throw 'error';
    console.log(`Limit: ${limit} Data.length: ${data.length} Total transfers recorded: ${report_array.dec_transfers.length}`);
    if (limit === data.length) {
      offset = 500 * Math.ceil(report_array.dec_transfers.length / 500);
      update_status(`Getting player DEC transactions with offset: ${offset}.`);
      request(
          `https://api2.splinterlands.com/players/balance_history?token_type=DEC&offset=${offset}&limit=${limit}&username=${report_array.player}${report_array.dec_query_types}`,
          0,
          context.playerDECBalanceHistory);
    } else {
      console.log(`DEC Transfers`, report_array.dec_transfer_types);
      request(`https://api2.splinterlands.com/players/balance_history?token_type=SPS&offset=0&limit=${limit}&username=${report_array.player}`, 0, context.playerSPSBalanceHistory);
    }
  }

  //Get player SPS history
  this.playerSPSBalanceHistory = function (data) {
    //console.log(data);
    let offset = 0;
    let limit = 500;
    data.forEach((e) => {
      if (!report_array.sps_transfer_types.includes(e.type)) report_array.sps_transfer_types.push(e.type);
      if (!report_array.sps_transfers.includes(e)) {
        report_array.sps_transfer_ids.push(e.trx_id);
        report_array.sps_transfers.push(e);
      } //else console.log(`${i}: ${e.id}`);
    });
    //throw 'error';
    console.log(`Limit: ${limit} Data.length: ${data.length} Total transfers recorded: ${report_array.sps_transfers.length}`);
    if (limit === data.length) {
      offset = 500 * Math.ceil(report_array.sps_transfers.length / 500);
      update_status(`Getting player SPS transactions with offset: ${offset}.`);
      request(
          `https://api2.splinterlands.com/players/balance_history?token_type=SPS&offset=${offset}&limit=${limit}&username=${report_array.player}`,
          0,
          context.playerSPSBalanceHistory);
    } else {
      console.log(`SPS Transfers`, report_array.sps_transfer_types);
      request(`https://api2.splinterlands.com/players/balance_history?token_type=VOUCHER&offset=0&limit=${limit}&username=${report_array.player}`, 0, context.playerVOUCHERBalanceHistory);
    }
  }

  //Get player VOUCHER history
  this.playerVOUCHERBalanceHistory = function (data) {
    //console.log(data);
    let offset = 0;
    let limit = 500;
    data.forEach((e) => {
      if (!report_array.voucher_transfer_types.includes(e.type)) report_array.voucher_transfer_types.push(e.type);
      if (!report_array.voucher_transfers.includes(e)) {
        report_array.voucher_transfer_ids.push(e.trx_id);
        report_array.voucher_transfers.push(e);
      } //else console.log(`${i}: ${e.id}`);
    });
    //throw 'error';
    console.log(`Limit: ${limit} Data.length: ${data.length} Total transfers recorded: ${report_array.voucher_transfers.length}`);
    if (limit === data.length) {
      offset = 500 * Math.ceil(report_array.voucher_transfers.length / 500);
      update_status(`Getting player VOUCHER transactions with offset: ${offset}.`);
      request(
          `https://api2.splinterlands.com/players/balance_history?token_type=VOUCHER&offset=${offset}&limit=${limit}&username=${report_array.player}`,
          0,
          context.playerSPSBalanceHistory);
    } else {
      console.log(`VOUCHER Transfers`, report_array.voucher_transfer_types);
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
            else if (match_type === `Tournament`) {
              tally_wdl(match_type);
              report_array.matches.Tournament.match_data.push(tx);
              report_array.matches.Tournament.match_data_tally++;
            } else if (match_type === `Practice`) {
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
                  report_array.earnings.loot_chests[dailyOrSeason].cards[gold][report_array.rewardsCards[chest.card.card_detail_id].rarity].dec += (chest.card.gold ? prices.cards[chest.card.card_detail_id].dec * (chest.card.card_detail_id > 330 ? 25 : 50) : prices.cards[chest.card.card_detail_id].dec);
                  report_array.earnings.loot_chests[dailyOrSeason].cards[gold].total.dec += (chest.card.gold ? prices.cards[chest.card.card_detail_id].dec * (chest.card.card_detail_id > 330 ? 25 : 50) : prices.cards[chest.card.card_detail_id].dec);
                  //Use ID to get DEC from prices array
                } else if (chest.type === `dec`) {
                  //console.log(`Loot: ${chest.quantity} DEC`);
                  report_array.earnings.loot_chests[dailyOrSeason].dec += chest.quantity;
                } else if (chest.type === `credits`) {
                  //console.log(`Loot: ${chest.quantity} DEC`);
                  report_array.earnings.loot_chests[dailyOrSeason].credits += chest.quantity;
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
          case "enter_tournament":
            //Add to tournament list
            let enter_result = JSON.parse(tx.data);
            report_array.matches.Tournament.ids.push(enter_result.tournament_id);
            break;
          case "token_transfer":
            //Add to tournament list
            let transfer_data = JSON.parse(tx.data);
            if (transfer_data.type === "enter_tournament") {
              report_array.matches.Tournament.ids.push(transfer_data.tournament_id);
            }
            break;
          case "leave_tournament":
            //Remove from tournaments list
            let leave_result = JSON.parse(tx.data);
            report_array.matches.Tournament.ids = report_array.matches.Tournament.ids.filter(t => t !== leave_result.tournament_id);
            break;
          default:
            console.log(`Unidentified case! ${tx.type}`, tx)
        }
      }
    });
    // DEC History Sorting
    report_array.dec_balances = {
      dec_reward: 0,
      rentals: {
        in: 0,
        fees: 0,
        out: 0,
        refund: 0,
        count: 0
      },
      leaderboard_prize: 0
    };
    report_array.dec_transfers.forEach((tx) => {
      let created_date = Date.parse(tx.created_date);
      let valid = false;
      if (created_date > report_array.season_start && created_date < report_array.season_end) valid = true;
      if (tx.type === "leaderboard_prizes") {
        valid = (created_date === report_array.season_end);
        console.log(`LEADERBOARD PRIZE`, tx, valid);
      }
      if (valid) {
        // rental_refund
        let amount = parseFloat(tx.amount);
        if (["rental_payment", "rental_payment_fees", "market_rental"].includes(tx.type)) report_array.dec_balances.rentals.count++;
        if (tx.type === "rental_payment") report_array.dec_balances.rentals.in += amount;
        else if (tx.type === "rental_payment_fees") report_array.dec_balances.rentals.fees += amount;
        else if (tx.type === "market_rental") report_array.dec_balances.rentals.out += amount;
        else if (tx.type === "rental_refund") report_array.dec_balances.rentals.refund += amount;
        else if (tx.type === "leaderboard_prizes") report_array.dec_balances.leaderboard_prize += amount;
        else if (tx.type === "dec_reward") report_array.dec_balances.dec_reward += amount;
        else console.log(`Unexpected DEC: ${tx.type}`);
      }
    });
    console.log(`DEC Transactions to report:`, report_array.dec_balances);
    if (report_array.dec_balances.rentals.count > 0) {
      let net_rentals_dec = report_array.dec_balances.rentals.in + report_array.dec_balances.rentals.fees + report_array.dec_balances.rentals.out + report_array.dec_balances.rentals.refund;
      let net_rentals = (net_rentals_dec).toFixed(3);
      if (parseFloat(net_rentals) < 0) net_rentals = `(${(net_rentals_dec * -1).toFixed(3)})`;
      report_array.rentals_table = `|Type|DEC (fees)|\n|-|-|\n|Revenue|${report_array.dec_balances.rentals.in.toFixed(3)} (${(report_array.dec_balances.rentals.fees * -1).toFixed(3)})|\n|Expenses|(${(report_array.dec_balances.rentals.out * -1).toFixed(3)})|\n|Cancellation Refunds|${report_array.dec_balances.rentals.refund.toFixed(3)}|\n|NET|${net_rentals}|`;
    }
    if (report_array.dec_balances.leaderboard_prize > 0) report_array.leaderboard_table = `|Prize|\n|-|\n|${report_array.dec_balances.leaderboard_prize} DEC|`;

    // SPS History Sorting
    report_array.sps_balances = {
      airdrop: 0,
      staking: 0
    };
    console.log(report_array.sps_transfers);
    report_array.sps_transfers.forEach((tx) => {
      let created_date = Date.parse(tx.created_date);
      let valid = false;
      if (created_date > report_array.season_start && created_date < report_array.season_end) valid = true;

      if (valid) {
        let amount = parseFloat(tx.amount);
        if (tx.type === "token_award") report_array.sps_balances.airdrop += amount;
        else if (tx.type === "claim_staking_rewards") report_array.sps_balances.staking += amount;
        else if (!["token_transfer", "stake_tokens"].includes(tx.type))
          console.log(`Unexpected SPS Type: ${tx.type}`);
      }
    });
    console.log(`SPS Transactions to report:`, report_array.sps_balances);
    if (report_array.sps_balances.airdrop > 0 || report_array.sps_balances.staking > 0) {
      let net_rentals_sps = report_array.sps_balances.airdrop + report_array.sps_balances.staking;
      let net_sps = (net_rentals_sps).toFixed(3);
      report_array.sps_table = `|Type|Amount Claimed|\n|-|-|\n|Airdrop|${report_array.sps_balances.airdrop.toFixed(3)}|\n|Staking Rewards|${report_array.sps_balances.staking.toFixed(3)}|\n|**NET SPS**|**${net_sps}**|`;
    }

    // VOUCHER History Sorting
    console.log(report_array.voucher_transfers);
    report_array.voucher_balance = 0;
    report_array.voucher_transfers.forEach((tx) => {
      let created_date = Date.parse(tx.created_date);
      let valid = false;
      if (created_date > report_array.season_start && created_date < report_array.season_end) valid = true;

      if (valid) {
        let amount = parseFloat(tx.amount);
        if (tx.type === "voucher_drop") report_array.voucher_balance += amount;
        else console.log(`Unexpected VOUCHER Type: ${tx.type}`);
      }
    });
    console.log(report_array.voucher_balance)
    if (report_array.voucher_balance > 0) {
      report_array.sps_table += `\n|+ *Voucher Drops*|${report_array.voucher_balance.toFixed(3)} VOUCHER|`;
    }

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

      report_array.matches.Tournament.data.forEach((tournament) => {
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
                });
                /* Commented out as already doing when gathering data.
                // W/L/D
                // report_array.matches.Tournament.wins += player.wins;
                // report_array.matches.Tournament.loss += player.losses;
                // report_array.matches.Tournament.draws += player.draws;
                // console.log(`---`);
                */
                break;
              }
            }
          }
        }
      });

      function add_to_prizeList(player, tournament, prizeArray) {
        console.log(prizeArray);
        // Where shared placement, prize info adjusted.
        if (player.ext_prize_info !== null)
          for (let prize of JSON.parse(player.ext_prize_info)) {
            prizeArray.forEach((standard_prize, i) => {
              if (prize.type === standard_prize.type) prizeArray[i].qty = parseFloat(prize.qty);
            });
          }
        //Add prize to culmulative earning for tournaments here...
        let ratio = (!isNaN(player.wins / (player.losses + player.draws)) ? (player.wins / (player.losses + player.draws)).toFixed(2) : 0);
        report_array.matches.Tournament.prize_list.push({
          Prize: prizeArray.reduce((string, prize, i) => `${string}${(prize.type === `CUSTOM`) ? prize.text : `${prize.qty} ${prize.type}`}${(prizeArray.length > 1 && i < prizeArray.length - 1) ? ` + ` : ``}`, ``),
          Tournament: `${tournament.name}`,
          num_players: `${tournament.num_players}`,
          League: `${rating_level[tournament.data.rating_level]}`,
          Editions: `${(tournament.data.allowed_cards.editions.length === 0 || tournament.data.allowed_cards.editions.length === 6) ? `Open` : `${tournament.data.allowed_cards.editions.reduce((list, ed) => list + editions[ed], ``)}`}`,
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

      let tournament_winnings_table_body = report_array.matches.Tournament.prize_list.reduce((body, row) => `${body}|${row.Tournament}|${row.League}|${row.Editions}|${row.Placement}/${row.num_players}|${row.Ratio}|${row.Prize}|\n`, ``)
      report_array.matches.Tournament.winnings_table =
          `### Prizes\n|Tournament|League|Editions|Placement/#entrants|Ratio (Win/Loss+Draw)|Prize|\n|-|-|-|-|-|-|\n${tournament_winnings_table_body}`

      let tournament_winnings_prize_summary_table_body = Object.values(report_array.matches.Tournament.prize_tally).reduce((body, row) => `${body}${(row.count > 0) ? `${`|${row.name}|${row.count}|${row.quantity}|\n`}` : ``}`, ``)
      report_array.matches.Tournament.prizes_table =
          `### Summary\n|Reward|Count|Quantity|\n|-|-|-|\n${tournament_winnings_prize_summary_table_body}`

      context.rewardsData();
    }
  }

  this.rewardsData = function () {
    update_status(`Counting Rewards.`);
    //Calculations for Rewards Cards
    let loot_chests = report_array.earnings.loot_chests;
    let calc = generateEarningsCalculations(loot_chests);

    report_array.earnings.template = generateEarningsTemplate(calc, loot_chests);
    update_status(`Generating card usage statistics.`);

    //context.cardUsageData(false);
    /* Changed for battle data being unavailable */
    drawer.draw(); // replace with link to drawer element
    console.log(`Finish`);
    context.enable_text_fields_and_post_button();
  }

  function generateEarningsCalculations(loot_chests) {
    let daily_cards = report_array.earnings.loot_chests.daily.cards;
    let season_cards = report_array.earnings.loot_chests.season.cards;
    let calc = {
      //Standard Cards Counts
      stand_common_count: daily_cards.stand[1].count + season_cards.stand[1].count,
      stand_rare_count: daily_cards.stand[2].count + season_cards.stand[2].count,
      stand_epic_count: daily_cards.stand[3].count + season_cards.stand[3].count,
      stand_legendary_count: daily_cards.stand[4].count + season_cards.stand[4].count,
      //Standard Cards DEC
      stand_common_dec: daily_cards.stand[1].dec + season_cards.stand[1].dec,
      stand_rare_dec: daily_cards.stand[2].dec + season_cards.stand[2].dec,
      stand_epic_dec: daily_cards.stand[3].dec + season_cards.stand[3].dec,
      stand_legendary_dec: daily_cards.stand[4].dec + season_cards.stand[4].dec,
      //Gold Cards Counts
      gold_common_count: daily_cards.gold[1].count + season_cards.gold[1].count,
      gold_rare_count: daily_cards.gold[2].count + season_cards.gold[2].count,
      gold_epic_count: daily_cards.gold[3].count + season_cards.gold[3].count,
      gold_legendary_count: daily_cards.gold[4].count + season_cards.gold[4].count,
      //Gold Cards DEC
      gold_common_dec: daily_cards.gold[1].dec + season_cards.gold[1].dec,
      gold_rare_dec: daily_cards.gold[2].dec + season_cards.gold[2].dec,
      gold_epic_dec: daily_cards.gold[3].dec + season_cards.gold[3].dec,
      gold_legendary_dec: daily_cards.gold[4].dec + season_cards.gold[4].dec,
      //Standard Cards Totals
      total_stand_count: daily_cards.stand.total.count + season_cards.stand.total.count,
      total_stand_dec: daily_cards.stand.total.dec + season_cards.stand.total.dec,
      //Gold Cards Totals
      total_gold_count: daily_cards.gold.total.count + season_cards.gold.total.count,
      total_gold_dec: daily_cards.gold.total.dec + season_cards.gold.total.dec,
      //Dailies Totals
      total_dailies_count: daily_cards.stand.total.count + daily_cards.gold.total.count,
      total_dailies_dec: daily_cards.stand.total.dec + daily_cards.gold.total.dec,
      //Season Totals
      total_season_count: season_cards.stand.total.count + season_cards.gold.total.count,
      total_season_dec: season_cards.stand.total.dec + season_cards.gold.total.dec
    };

    //Cards Total DEC
    calc.total_all_count = calc.total_dailies_count + calc.total_season_count;
    calc.total_all_dec = calc.total_dailies_dec + calc.total_season_dec;

    //Calculations for Packs
    let sum_loot_chests = (str) => loot_chests.daily[str] + loot_chests.season[str];
    //UNTAMED Packs
    calc.total_untamed_packs_count = sum_loot_chests('untamed_packs');
    calc.total_untamed_packs_dec = calc.total_untamed_packs_count * prices.untamed_pack;

    //Calculations for Potions
    //Legendary
    calc.total_legendary_potions_count = sum_loot_chests('legendary_potion');
    calc.total_legendary_potions_dec = calc.total_legendary_potions_count * prices.LEGENDARY;
    //Alchemy
    calc.total_alchemy_potions_count = sum_loot_chests('legendary_potion');
    calc.total_alchemy_potions_dec = calc.total_alchemy_potions_count * prices.GOLD;

    //Calculations for Capture DEC
    report_array.earnings.matches = parseInt(report_array.earnings.matches.toFixed(3));

    //Calculations for Loot Chest DEC
    calc.total_loot_dec = sum_loot_chests('dec');
    calc.total_loot_credits = sum_loot_chests('credits');
    calc.total_dec = calc.total_all_dec + calc.total_untamed_packs_dec
      + calc.total_legendary_potions_dec + calc.total_alchemy_potions_dec
      + calc.total_loot_dec + report_array.dec_balances.dec_reward/*report_array.earnings.matches*/;
    return calc;
  }

  function generateEarningsTemplate(calc, loot_chests) {
    return `##### Standard Foil Cards\n
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
|Legendary Potions|${loot_chests.daily.legendary_potion}|${loot_chests.season.legendary_potion}|${calc.total_legendary_potions_count}|${calc.total_legendary_potions_dec}|
|Alchemy Potions|${loot_chests.daily.alchemy_potion}|${loot_chests.season.alchemy_potion}|${calc.total_alchemy_potions_count}|${calc.total_alchemy_potions_dec}|
|DEC|${loot_chests.daily.dec}|${loot_chests.season.dec}|-|${calc.total_loot_dec}|
|CREDITS|${loot_chests.daily.credits}|${loot_chests.season.credits}|-|${calc.total_loot_credits}|
|UNTAMED Packs|${loot_chests.daily.untamed_packs}|${loot_chests.season.untamed_packs}|${calc.total_untamed_packs_count}|${calc.total_untamed_packs_dec}|
|Cards (Total)|${calc.total_dailies_count}|${calc.total_season_count}|${calc.total_all_count}|${calc.total_all_dec}|
${(report_array.dec_balances.leaderboard_prize > 0) ? `\n### Leaderboard Prizes\n\n${report_array.leaderboard_table}\n\n` : `\n`} 
#### Captured DEC (Ranked Rewards)\n
|Ranked Play Wins|DEC Earned|
|-|-|
|${report_array.matches.api_wins_count}|${report_array.dec_balances.dec_reward.toFixed(0)}|

#### Total Ranked Play Rewards\n
|Total Ranked Play Earnings|
|-|
|${(calc.total_dec + report_array.dec_balances.leaderboard_prize).toFixed(0)} DEC|
|${calc.total_loot_credits} CREDITS|`;
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
                if (c.id === id) {
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
      report_array.matches.cards.used_cards_details.forEach((card) => {
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
          array.forEach((c2) => {
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
      Object.values(toDelete).forEach((instructions) => {
        let count = 0, newIdentifier = ``, newType = ``, name, id, wins = 0;
        //console.log(`Deletion instructions`, instructions);
        Object.values(instructions).forEach(instance => {
          //console.log(instance);
          count += instance.count;
          wins += instance.wins;
          newIdentifier += `*${instance.identifier}`;
          newType = instance.type;
          name = report_array.matches.cards[newType][newIdentifier].name;
          id = report_array.matches.cards[newType][newIdentifier].id;
          delete report_array.matches.cards[newType][newIdentifier];
        });

        report_array.matches.cards[newType][newIdentifier] = {
          identifier: newIdentifier, count: count, name: name, id: id,
          type: newType, wins: wins
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

        let total = arrayOfCards.reduce((total, card) => total + card.count, 0);
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

    // For checking:
    console.log(`DEC sm_battle: ${report_array.earnings.matches}\nDEC balance history: ${report_array.dec_balances.dec_reward.toFixed(3)}`);

    drawer.draw(); // replace with link to drawer element
    console.log(`Finish`);
    context.enable_text_fields_and_post_button();
  }

  this.enable_text_fields_and_post_button = function () {
    report_array.text_fields.forEach(text_field => {
      el(text_field).disabled = false;
      //console.log(`Enabling ${text_field}`);
    });
    if (report_array.matches.Tournament.ids.length > 0) {
      el(`tournamentResults`).disabled = false;
      el(`tournament`).style.display = "inline";
    }
    if (report_array.dec_balances.rentals.count > 0) {
      el(`rentals`).disabled = false;
      el(`rental`).style.display = "inline";
    }

    if (report_array.sps_balances.airdrop > 0 || report_array.sps_balances.staking > 0) {
      el(`sps`).disabled = false;
      el(`sps_txt`).style.display = "inline";
    }

    el('post').disabled = false;
  }
}