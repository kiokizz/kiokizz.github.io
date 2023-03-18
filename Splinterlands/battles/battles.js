const el = id => document.getElementById(id);

let data = {}
let tables = {}

init()

async function init() {
  // ToDo cache loaded data??
  await load_season_data(`106`)
  change_table()
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
  for (let x of [`combined`, `modern`, `wild`]) if (document.getElementById(`format_${x}`).checked) format = x;

  let league;
  for (let x of [`Bronze`, `Silver`, `Gold`, `Diamond`, `Champ`]) if (document.getElementById(`league_${x}`).checked) league = x;

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

  let report_mon = `<table class="w3-table w3-striped w3-bordered" id="monster"><tr><th onclick="change_table('usage_rate', 'monster')">Usage%</th><th onclick="change_table('name', 'monster')">Monster</th><th onclick="change_table('win_count', 'monster')">Win</th><th onclick="change_table('loss_count', 'monster')">Loss</th><th onclick="change_table('win_rate', 'monster')">Win Rate</th><th onclick="change_table('rating_movement', 'monster')">Rating Index</th></tr>`
  let report_sum = `<table class="w3-table w3-striped w3-bordered" id="summoner"><tr><th onclick="change_table('usage_rate', 'summoner')">Usage%</th><th onclick="change_table('name', 'summoner')">Monster</th><th onclick="change_table('win_count', 'summoner')">Win</th><th onclick="change_table('loss_count', 'summoner')">Loss</th><th onclick="change_table('win_rate', 'summoner')">Win Rate</th><th onclick="change_table('rating_movement', 'summoner')">Rating Index</th></tr>`

  for (let card of selected_data) {
    if (typeof card !== "object") continue
    if (card.play_count < 50) continue
    let row =
        `<tr>`
        + `<td>${card.usage_rate.toFixed(2)}%</td>`
        + `<td>${card.name}</td>`
        + `<td>${card.win_count}</td>`
        + `<td>${card.play_count - card.win_count}</td>`
        + `<td>${card.win_rate.toFixed(2)}%</td>`
        + `<td>${card.rating_movement.toFixed(0)}</td>`
        + `</tr>\n`
    if (card.type === `Monster`) report_mon += row
    else if (card.type === `Summoner`) report_sum += row
  }

  report_mon += `</table>`
  report_sum += `</table>`

  el(`data`).innerHTML =
      `<h2>Summoners</h2>`
      + report_sum
      + `<br><br>`
      + `<h2>Monsters</h2>`
      + report_mon
}