function sm_battle(battle, username) {
  let result = JSON.parse(battle.result);
  this.match_type = result.match_type;
  this.win = result.winner === username ? 1 : (result.winner === 'DRAW' ? 0 : -1);
  this.rulesets = result.ruleset.split("|");

  let opponent_tx = result.players.find(player => player.name !== username);
  this.opponent = {
    name: opponent_tx.name,
    initial_rating: opponent_tx.initial_rating,
    final_rating: opponent_tx.final_rating,
    team: opponent_tx.team,
  };

  let player_tx = result.players.find(player => player.name === username);
  this.player = {
    name: player_tx.name,
    initial_rating: player_tx.initial_rating,
    final_rating: player_tx.final_rating,
    team: player_tx.team,
  };

  this.rating_movement = Math.abs((player_tx.initial_rating - player_tx.final_rating));
}
