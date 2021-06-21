function create_player(username, season) {
  let league = rankings[season.league].name;
  let league_name = rankings[season.league].group;

  let sm_battles = [];

  let matches = {};
  let tournament_ids = [];
  let tournaments = {};

  if (season.reward_claim_tx === null) {
    show_error(`Season rewards have not been claimed. Please claim before proceeding. Please refresh the page before proceeding.`);
    return false;
  }

  let instantiate_data = async function (input_txs) {
    let txs = {};
    input_txs.forEach(tx => (!txs[tx.type]) ? txs[tx.type] = [tx] : txs[tx.type].push(tx));
    console.log(txs);

    txs.sm_battle.forEach(battle => sm_battles.push(new sm_battle(battle, username)));
    console.log(sm_battles);

    tournament_ids = get_current_tournaments(txs);
    await compile_match_data(sm_battles);
  }

  let get_current_tournaments = function (txs) {
    txs.enter_tournament = txs.enter_tournament ? txs.enter_tournament : [];
    txs.leave_tournament = txs.leave_tournament ? txs.leave_tournament : [];

    txs.enter_tournament.forEach(tx => {
      tx = parse_tournament_json(tx);
      if (tx.success) tournament_ids.push(tx.id);
    });
    txs.leave_tournament.forEach(tx => {
      tx = parse_tournament_json(tx);
      if (!tx.success) return;
      let index = tournament_ids.findIndex(tx.id);
      if (index != -1) tournament_ids.splice(index, 1);
    });
  }

  function parse_tournament_json(tx) {
    let result = JSON.parse(tx.data);
    console.log(result);
    return {
      id: result.tournament_id,
      success: tx.success
    }
  }

  let compile_match_data = async function (battles) {
    matches.Ranked = {wins: 0, loss: 0, draws: 0, count: 0}
    matches.Tournament = {wins: 0, loss: 0, draws: 0, count: 0, ids: [], prize_list: []}
    matches.rulesets = {};
    matches.teams = [];
    matches.opponents = [];
    matches.higestRatedOpp = {};
    /*
       match data -> team of the player -> card usage data

       network request - card details

       generate monster & summoner usage.
     */

    // TODO


    battles.forEach(battle => {
      let match_type = battle.match_type;
      let won_battle = (battle.outcome > 1);

      if (match_type !== 'Practice') {
        if (battle.outcome == 1) matches[match_type].wins++;
        if (battle.outcome == 0) matches[match_type].draws++;
        if (battle.outcome == -1) matches[match_type].loss++;
        if (match_type === `Ranked`) matches.earnings.matches += battle.dec_info.reward;
      } //TODO Brawl distinction

      //console.log(`Battle Result Json`, json);
      battle.rulesets.forEach(ruleset => {
        if (!matches.rulesets[ruleset])
          matches.rulesets[ruleset] = {name: ruleset, wins: 0, loss: 0, draws: 0, count: 0};
        matches.rulesets[ruleset].count++;
        if (battle.outcome == 1) matches.rulesets[ruleset].wins++;
        if (battle.outcome == 0) matches.rulesets[ruleset].draws++;
        if (battle.outcome == -1) matches.rulesets[ruleset].loss++;
      });
/*
      cardCount(battle.player, won_battle, battle);
      cardCount(battle.opponent, won_battle, battle);

      function cardCount(account, won_battle, battle) {
        matches.opponents.push(battle.opponent.name);
        if (won_battle) {
          let oppHighRating = Math.max(account.initial_rating, account.final_rating);
          if (oppHighRating >= matches.higestRatedOpp.rating) {
            if (oppHighRating > matches.higestRatedOpp.rating) {
              matches.higestRatedOpp.name = `@[${account.name}](https://splinterlands.com?p=battle&id=${battle.id}&ref=splinterstats)`;
              matches.higestRatedOpp.rating = oppHighRating;
            } else if (!matches.higestRatedOpp.name.includes(`@${account.name}`)) {
              matches.higestRatedOpp.name += ` & @[${account.name}](https://splinterlands.com?p=battle&id=${battle.id}&ref=splinterstats)`
            }
          }
        }


    else
      {
        if (Object.keys(account.team).length !== 0) account.team.win = won_battle;
        matches.teams.push(account.team);
        matches.ratingMovement += Math.abs((account.initial_rating - account.final_rating));
      }
    }

*/ // TODO Ben and Kiran. This is where we're at. Fix this, you morons.
  }
);

/* ToDO
Number of Attacks [melee, ranged, magic], Misses / Reflects
Total Heals, card: {id: `xx-xx-xxxxxx`, healed: ?}
Generate usage statistics from team data.
*/
}

let set_tournaments = function (input_tournaments) {
  tournaments = input_tournaments;
}

return {
  username,
  league,
  league_name,
  season,
  matches,
  tournament_ids,
  instantiate_data,
  set_tournaments
};

}