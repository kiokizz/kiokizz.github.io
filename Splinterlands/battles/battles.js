const el = id => document.getElementById(id);

let data = {}
let title_string = `.`
let battles_string = `.`
let utc_string = `.`
let cards = {}
let prices = {}
let season

let emojis = {
  Red: `🔴`,
  Blue: `🔵`,
  Green: `🟢`,
  White: `⚪`,
  Gray: `🌑`,
  Black: `🟣`,
  Gold: `🟡`
}

let edition_ids = {
  "alpha": "0,1",
  "beta": "0,1",
  "promo": "2",
  "reward": "3",
  "untamed": "4",
  "dice": "5",
  "gladius": "6",
  "chaos": "7",
  "rift": "8",
  "soulbound": "10",
  "rebellion": "12"
};

const splinterColor = {
  fire: `Red`,
  earth: `Green`,
  life: `White`,
  neutral: `Gray`,
  dragon: `Gold`,
  water: `Blue`,
  death: `Black`
};

let domain = `https://${window.location.hostname}`

init()

async function init() {
  // ToDo cache loaded data??
  await get_card_details();
  await get_card_prices()
  season = await get_parameter_by_name(`season`)
  season = (season && season !== '' && !Number.isNaN(season)) ? season : `153`
  await load_season_data(season)
  await assign_value_index()
  seasonListElementD.value = `${domain}/battles.html?season=${season}`
  document.getElementById(`season=${season}`).classList.remove("w3-theme-light")
  document.getElementById(`season=${season}`).classList.add("w3-grey")
  console.log(`Loaded Page: ${domain}/battles.html?season=${season}`)
  // console.log(title_string, battles_string, utc_string)
  el('title_string').innerHTML = `<h2>${title_string}</h2>`
  el('battles_string').innerHTML = `${battles_string}`
  el('utc_string').innerHTML = utc_string
  change_table()
}

async function get_card_details(name) {
  let url = `https://api2.splinterlands.com/cards/get_details`
  let raw_data = (await axios.get(url)).data;
  let result_data = {};
  raw_data.forEach((card) => result_data[card.id] = card);
  // console.log(result_data)
  cards = result_data
  console.log(cards)
}

async function get_card_prices(name) {
  let url = `https://api2.splinterlands.com/market/for_sale_grouped`
  let raw_data = (await axios.get(url)).data;
  let result_data = {};
  raw_data.forEach((card) => {
    if (!result_data[card.card_detail_id]) result_data[card.card_detail_id] = {}
    result_data[card.card_detail_id][card.gold] = card
  })
  prices = result_data
  console.log(prices)
}

async function assign_value_index(name) {
  let rarity_multiplier = {
    1: 400,
    2: 115,
    3: 46,
    4: 11
  }

  console.log("assign_value_index")
  for (let report of Object.values(data)) {
    let total_ri = 0
    for (let card of report) {
      total_ri += card.rating_movement
    }
    for (let card of report) {
      let rarity = cards[card.id].rarity

      card.price_index_false = 0
      card.price_index_true = 0

      if (prices[card.id])
        if (prices[card.id][false]) card.price_index_false = card.rating_movement / prices[card.id][false].low_price_bcx / rarity_multiplier[rarity]
    }
  }
  console.log(data)
}

async function load_season_data(name) {
  console.log('load_season_data')
  return new Promise((resolve, reject) => {
    try {
      let data_importer = document.createElement("script");
      data_importer.setAttribute("src", `./battles/data_files/${name}.js`);

      data_importer.addEventListener("load", (event) => {
        console.log("File loaded", data)
        resolve({status: true, data: data[name]});
      });

      data_importer.addEventListener("error", (event) => {
        reject({
          status: false, data: false, event
        });
      });

      document.body.appendChild(data_importer);
    } catch (error) {
      reject(error);
    }
  });
}

let sorted = {
  default_field: false,
  default_sort: false
};

async function change_table(field = false) {
  let format;
  for (let x of [`combined`, `modern`, `wild`]) if (document.getElementById(`format_${x}`).checked) format = x

  let league;
  for (let x of [`Bronze`, `Silver`, `Gold`, `Diamond`, `Champ`]) if (document.getElementById(`league_${x}`).checked) league = x

  let splinters = []
  for (let x of [`fire`, `water`, `earth`, `life`, `death`, `dragon`, `neutral`]) if (el(x).checked) splinters.push(splinterColor[x])

  let editions = [];
  for (let x of ["alpha", "beta", "promo", "reward", "untamed", "dice", "gladius", "chaos", "rift", "rebellion"]) if (el(x).checked) {
    if (x === "beta") editions.push("1", "0,1")
    else if (x === "reward") editions.push("3", "10", "13")
    else editions.push(edition_ids[x])
  }

  console.log(format, league, field, sorted[field])
  let selected_data = data[`${format}${league}`]

  // Sort Data if enabled
  if (field) sort(field)
  else if (sorted.default_field) {
    field = sorted.default_field
    sorted[field] = sorted.default_sort * -1
    sort(field)
  }

  function sort(field) {
    if (sorted[field] === undefined) sorted[field] = 1
    else sorted[field] *= -1
    sorted.default_field = field
    sorted.default_sort = sorted[field]

    selected_data = selected_data.sort((a, b) => {
      let x = a[field]
      let y = b[field]
      if (['name'].includes(field)) {
        x = x.toLowerCase()
        y = y.toLowerCase()
      }

      if (x > y) return 1 * sorted[field]
      else return -1 * sorted[field]
    });
  }

  let report_mon = `<table class="w3-table w3-striped w3-bordered" id="monster"><tr><th onclick="change_table('usage_rate', 'monster')">Usage%</th><th onclick="change_table('name', 'monster')">Monster</th><th>Average Level</th><th onclick="change_table('win_count', 'monster')">Win</th><th onclick="change_table('loss_count', 'monster')">Loss</th><th onclick="change_table('win_rate', 'monster')">Win Rate</th><th onclick="change_table('rating_movement', 'monster')">Rating Index</th><th onclick="change_table('price_index_false', 'monster')">Estimated Value/Performance (NFA-DYOR)<br><code>Rating Index / LowBCX$ / C400/R115/E46/L11)</code></th></tr>`
  let report_sum = `<table class="w3-table w3-striped w3-bordered" id="summoner"><tr><th onclick="change_table('usage_rate', 'summoner')">Usage%</th><th onclick="change_table('name', 'summoner')">Summoner</th><th>Average Level</th><th onclick="change_table('win_count', 'summoner')">Win</th><th onclick="change_table('loss_count', 'summoner')">Loss</th><th onclick="change_table('win_rate', 'summoner')">Win Rate</th><th onclick="change_table('rating_movement', 'summoner')">Rating Index</th><th onclick="change_table('price_index_false', 'summoner')">Estimated Value/Performance (NFA-DYOR)<br><code>Rating Index / LowBCX$ / C400/R115/E46/L11)</code></th></tr>`

  function cardFilterPass(card) {
    let pass = true;

    card = cards[card.id]
    // console.log(card)
    // console.log({format, league, splinters, editions})

    if (editions.length > 0 && splinters.length > 0) pass = editions.includes(card.editions) && splinters.includes(card.color)
    else if (editions.length > 0) pass = editions.includes(card.editions)
    else if (splinters.length > 0) pass = splinters.includes(card.color)

    // console.log(pass)
    return pass;
  }

  for (let card of selected_data) {
    if (typeof card !== "object") continue
    if (card.play_count < 50) continue
    if (!cardFilterPass(card)) continue
    let row =
        `<tr>`
        + `<td>${card.usage_rate.toFixed(2)}%</td>`
        + `<td>${emojis[cards[card.id].color]} ${card.name}</td>`
        + `<td>${card.average_level ? card.average_level.toFixed(2) : `-`}</td>`
        + `<td>${card.win_count}</td>`
        + `<td>${card.play_count - card.win_count}</td>`
        + `<td>${card.win_rate.toFixed(2)}%</td>`
        + `<td>${card.rating_movement.toFixed(0)}</td>`
        + `<td>${card.price_index_false.toFixed(2)}</td>`
        + `</tr>\n`
    if (card.type === `Monster`) report_mon += row
    else if (card.type === `Summoner`) report_sum += row
  }

  report_mon += `</table>`
  report_sum += `</table>`

  let summoner_div = `<h2>🧙 Summoners</h2>` + report_sum
  let monster_div = `<h2>👾 Monsters</h2>` + report_mon

  let data_div = ``;
  let monsters = el(`monsters`).checked
  let summoners = el(`summoners`).checked

  console.log(monsters, summoners)

  if (monsters && summoners || !monsters && !summoners) data_div = summoner_div + `<br><br>` + monster_div
  else if (monsters) data_div = monster_div
  else if (summoners) data_div = summoner_div

  el(`data`).innerHTML = data_div
}

async function get_parameter_by_name(name) {
  let url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
  let results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}