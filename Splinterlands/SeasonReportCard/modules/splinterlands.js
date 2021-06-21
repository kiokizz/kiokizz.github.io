function create_splinterlands() {
  let settings = false;
  let player = null;
  let current_season_id = null;
  let card_details = null;

  async function load_settings() {
    update_status(`Getting Splinterlands settings.`);
    let url = "https://game-api.splinterlands.com/settings";
    settings = await attempt_get_request(url, 5);
    generateSeasonEndTimes();
    return !!settings;
  }

  function get_season_string() {
    if (!settings) return '';

    let name = settings.season.name;
    let nameNum = name.substring(name.length - 2, name.length);
    current_season_id = settings.season.id;

    let next_season = Date.parse(settings.season.season_end_times[current_season_id]);
    let remaining_time = next_season - new Date().getTime();
    let time = {
      day: Math.floor(remaining_time / (1000 * 60 * 60 * 24)),
      hrs: Math.floor((remaining_time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      min: Math.floor((remaining_time % (1000 * 60 * 60)) / (1000 * 60)),
      sec: Math.floor((remaining_time % (1000 * 60)) / 1000)
    };

    return `Current Season: ${nameNum}. Time to post for Season ${nameNum - 1} - ${time.day} Days ${time.hrs} Hrs ${time.min} Min ${time.sec} Sec.`;
  }

  async function set_player(username) {
    if (!username || !current_season_id) return false;

    let url = `https://api2.splinterlands.com/players/season_details?name=${username}`;
    let season_records = await attempt_get_request(url);
    let previous_season = season_records.find(season => season.season == current_season_id - 1);

    console.log(previous_season);
    if (!previous_season) {
      show_error('There are no player records for the previous season');
      return false;
    }

    player = create_player(username, previous_season);
    return !!player;
  }

  let get_player = function () {
    return player;
  }

  let load_standard_data = async function () {
    card_details = attempt_get_request('https://game-api.splinterlands.com/cards/get_details');
    let player_txs = await get_player_txs();
    player_txs = remove_duplicate_txs(player_txs);
    await player.instantiate_data(player_txs);
    player.set_tournaments(await load_tournament_details(player.tournament_ids))
    console.log(`Player History`, player_txs);
  }
  let load_card_identifiers = async function (unique_card_ids) {
    // TODO
  }

  return {
    player,
    load_settings,
    get_season_string,
    set_player,
    get_player,
    load_standard_data,
    load_card_identifiers
  };

  async function get_player_txs(txs = [], last_tx_block = '') {
    let txs_per_request = 500;

    update_status(`Getting player transactions before block: ${last_tx_block}.`);
    let url = `https://api.steemmonsters.io/players/history?username=${player.username}&from_block=-1&before_block=${last_tx_block}&limit=${txs_per_request}`;
    let request_txs = await attempt_get_request(url);

    request_txs.forEach(e => txs.push(e));
    last_tx_block = request_txs[request_txs.length - 1].block_num;

    if (request_txs.length === txs_per_request) txs = await get_player_txs(txs, last_tx_block);
    return txs;
  }

  function remove_duplicate_txs(txs) {
    let ids = [];
    return txs.filter(tx => !ids.includes(tx.id) && ids.push(tx.id));
  }

  function generateSeasonEndTimes() {
    if (!settings) return;

    // season origin
    let ref = {id: 55, YYYY: 2021, MM: 1, DD: 31, HH: `14`};
    let hours = [`02`, `08`, `14`, `20`];

    settings.season.season_end_times = [];
    for (let i = 0; i < 240; i++) {
      settings.season.season_end_times[ref.id + i] =
        `${ref.YYYY}-${(ref.MM.toString().length == 1)
          ? `0${ref.MM}` : ref.MM}-${(ref.DD.toString().length == 1)
          ? `0${ref.DD}` : ref.DD}T${ref.HH}:00:00.000Z`;
      //YYYY MM DD
      if (ref.DD == 15) {
        //next half of month
        ref.DD = new Date(ref.YYYY, ref.MM, 0).getDate()
      } else {
        //next month
        ref.DD = 15;
        if (ref.MM == 12) {
          ref.YYYY++;
          ref.MM = 1;
        } else ref.MM++;
      }
      //HH
      let cycle = hours.indexOf(ref.HH);
      ref.HH = (cycle == 3) ? hours[0] : hours[cycle + 1];
    }
  }

  async function load_tournament_details(tournament_ids) {
    let tournaments = {};
    for (const tx of tournament_ids) {
      update_status(`Getting data for tournament: ${tx}`)
      let url = `https://api2.splinterlands.com/tournaments/find?id=${tx}`;
      let data = await attempt_get_request(url);
      // todo errors?
      tournaments[tx] = data;
    }

    console.log(tournaments)
    return tournaments;
  }
}