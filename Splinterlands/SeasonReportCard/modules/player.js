function create_player(username, season) {
  let league = rankings[season.league].name;
  let league_name = rankings[season.league].group;

  if (season.reward_claim_tx === null) {
    show_error(`Season rewards have not been claimed. Please claim before proceeding. Please refresh the page before proceeding.`);
    return false;
  }

  let instantiate_data = async function (input_txs) {
    let txs = {};
    input_txs.forEach(tx => (!txs[tx.type]) ? txs[tx.type] = [tx] : txs[tx.type].push(tx));
    console.log(txs);

    // TODO create any modules/objects
  }

  return {
    username,
    instantiate_data
  };
}