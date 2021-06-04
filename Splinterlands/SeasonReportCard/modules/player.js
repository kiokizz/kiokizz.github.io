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
    matches = await compile_match_data(sm_battles);
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
    let matches = {};

    /*
      Season player data - current rating + league

      matches:
       rating movemens
       ranked ratio
       tournament ratio
       longest streak
       highest rated opponent

       match data -> team of the player -> card usage data

       network request - card details

       generate monster & summoner usage.
     */

    // TODO

    return matches;
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