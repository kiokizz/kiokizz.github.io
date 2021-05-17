function create_player(season) {
  let league = rankings[season.league].name;
  let league_name = rankings[season.league].group;

  if (season.reward_claim_tx === null) {
    show_error(`Season rewards have not been claimed. Please claim before proceeding. Please refresh the page before proceeding.`);
    return false;
  }


  return {
    'stand_in': 'stand_in'
  };
}