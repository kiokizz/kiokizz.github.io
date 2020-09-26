const data = [];
let cards = [];
let sorted = "";

let league = "bronze";
let summoner = 2;
let abilitiesList = [];
let editionsToFilter = [];
let abilitiesToFilter = [];
let statFilter = ["none"];

function getCards() {
  let url = "https://game-api.splinterlands.com/cards/get_details";

  $.get(url, function (data) {
    cards = data;
    console.log(data);
    calculations();
  });
}

function calculations() {
  data.length = 0;
  sorted = "";

  const rarities = {
    1: "Common",
    2: "Rare",
    3: "Epic",
    4: "Legendary"
  };

  const leageCaps = {
    novice: [1, 1, 1, 1],
    bronze: [3, 2, 2, 1],
    silver: [5, 4, 3, 2],
    gold: [8, 6, 5, 3],
    diamond: [10, 8, 6, 4],
    champion: this.diamond
  };

  const summonerCaps = {
    Common: {
      1: [1, 1, 1, 0],
      2: [2, 2, 1, 1],
      3: [3, 2, 2, 1],
      4: [4, 3, 2, 2],
      5: [5, 4, 3, 2],
      6: [6, 5, 4, 2],
      7: [7, 6, 4, 3],
      8: [8, 6, 5, 3],
      9: [9, 7, 5, 4],
      10: [10, 8, 6, 4]
    },
    Rare: {
      1: [1, 1, 1, 1],
      2: [3, 2, 2, 1],
      3: [4, 3, 2, 2],
      4: [5, 4, 3, 2],
      5: [6, 5, 4, 3],
      6: [8, 6, 5, 3],
      7: [9, 7, 5, 4],
      8: [10, 8, 6, 4]
    },
    Epic: {
      1: [2, 1, 1, 1],
      2: [3, 3, 2, 1],
      3: [5, 4, 3, 2],
      4: [7, 5, 4, 3],
      5: [8, 7, 5, 3],
      6: [10, 8, 6, 4]
    },
    Legendary: {
      1: [3, 2, 2, 1],
      2: [5, 4, 3, 2],
      3: [8, 6, 5, 3],
      4: [10, 8, 6, 4]
    }
  };

  // League && Rarity --> Summoner Level --> Monster Level
  let thisLeague = leageCaps[league];
  let summonerLevel = thisLeague[summoner - 1];
  let summonersCap = summonerCaps[rarities[summoner]];
  let levelCaps = summonersCap[summonerLevel];

  console.log(summoner, league, summonerCaps);

  cards.forEach(card => {
    if (card.type !== "Monster") return;

    let level = (league === "novice" && summoner !== 1) ?
                0 : levelCaps[card.rarity - 1] - 1;

    let obj = {
      level: level,
      card: card.name,
      mana: card["stats"].mana[level],
      health: card["stats"].health[level],
      armor: card["stats"].armor[level],
      speed: card["stats"].speed[level],
      attack: card["stats"].attack[level],
      ranged: card["stats"].ranged[level],
      magic: card["stats"].magic[level],
      abilities: "",
      color: card.color
    };

    obj.abilities = card["stats"].abilities
      .filter((c, i) => (i <= level && c.length))
      .map(c => c.join(", "))
      .join(', ');

    obj.abilitiesArray = obj.abilities.split(", ");
    obj.abilitiesArray
      .filter(c => c !== "" && !abilitiesList.includes(c))
      .map(c => abilitiesList.push(c));
    obj.abilities = obj.abilities.replace(",", ", ");

    let editions = {
      "0,1": "beta",
      "1": "beta",
      "2": "promo",
      "3": "reward",
      "4": "untamed",
      "5": "dice",

    };
    obj.edition = editions[card["editions"]];

    //Filters
    let fail = !abilitiesToFilter
      .reduce((p, c) => p && obj.abilitiesArray.includes(c), true);
    if (fail) return;

    //ToList Edition
    fail = editionsToFilter.length >= 1
      && !editionsToFilter.includes(obj.edition);
    if (fail) return;

    //ToList Stat
    let filter =
      (statFilter[1] === "<") ? (a, b) => a < b :
      (statFilter[1] === ">") ? (a, b) => a > b : (a, b) => a === b;

    fail = statFilter[0] !== "none" && statFilter[2] &&
      !filter(obj[statFilter[0]], parseInt(statFilter[2]));
    if (fail) return;

    data.push(obj);
  });
  makeTable();
}

function makeTable() {
  const backgroundColor = {
    Red: "#FF3333",
    Green: "#00CC66",
    White: "#F5F5F5",
    Gray: "#BEBEBE",
    Gold: "#FFCC33",
    Blue: "#00CCFF",
    Black: "#663399"
  };

  const textColor = {
    Red: "black",
    Green: "black",
    White: "black",
    Grey: "black",
    Gold: "black",
    Blue: "black",
    Black: "white"
  };

  let rows = data.reduce((p, c) => {
      let style = `style="background-color:${backgroundColor[c.color]};${textColor[c.color]}"`;

      //https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/Creeping%20Ooze_lv1.png
      let urlName = c.card.replace(/\s/g, "%20");
      let level = (c.level + 1);
      let imageLink = `https://d36mxiodymuqjm.cloudfront.net/cards_by_level/${c.edition}/${urlName}_lv${level}.png`;
      let tool_tip = `
<a class="tooltip">${c.card}<span>
   <img style="max-width:100%;height:auto;" src="${imageLink}" alt="">
</span></a>`;

      return `${p}
<tr>
  <td ${style}> ⭐<b>${level}</b> | ${tool_tip}</td>
  <td>${c.mana}</td><td>${c.health}</td><td>${c.armor}</td>
  <td>${c.speed}</td><td>${c.attack}</td><td>${c.ranged}</td>
  <td>${c.magic}</td><td>${c.abilities}</td>
</tr>`;
    },
    "");

  let table = `
<table>
  <tr>
    <th>
      <button id="card_btn" class="btn">${league}|${rarities[summoner]}</button>
      <button id="color_btn" class="btn">🌈</button>
    </th>
    <th><button id="mana_btn" class="btn">🔮 Mana</button></th>
    <th><button id="health_btn" class="btn">💗 Health</button></th>
    <th><button id="armor_btn" class="btn">🛡️ Armor</button></th>
    <th><button id="speed_btn" class="btn">⏩ Speed</button></th>
    <th><button id="attack_btn" class="btn">🗡️ Melee</button></th>
    <th><button id="ranged_btn" class="btn">🏹 Ranged</button></th>
    <th><button id="magic_btn" class="btn">✨ Magic</button></th>
    <th>Abilities</th>
  </tr>
  ${rows}
</table>`;

  el('abilities').innerHTML =
    abilitiesList.reduce((p, c) => `${p}<option value="${c}">`);

  createHTMLPage(table);
}

function createHTMLPage(table) {
  el("displayStats").innerHTML = table;

  const sort_buttons = [
    {id: 'color_btn', column: 'color'},
    {id: 'card_btn', column: 'card'},
    {id: 'mana_btn', column: 'mana'},
    {id: 'health_btn', column: 'health'},
    {id: 'armor_btn', column: 'armor'},
    {id: 'speed_btn', column: 'speed'},
    {id: 'attack_btn', column: 'attack'},
    {id: 'ranged_btn', column: 'ranged'},
    {id: 'magic_btn', column: 'magic'},
  ];
  sort_buttons.map(c => el(c.id).onclick = () => sortTable(c.column));

  el("selectors").style.display = "inline-block";

  let CSVs = document.getElementsByClassName("CSV");
  Array.from(CSVs).map(c => c.style.display = "block");

  el("selectorsFilter").onclick = () => {
    summoner = parseInt(el("Summoner").value);
    league = el("League").value;

    const additionFilters = ["beta", "promo", "reward", "untamed", "dice"];
    editionsToFilter = additionFilters.filter(c => el(c).checked);

    let abilities = [
      el("ability1").value,
      el("ability2").value,
      el("ability3").value
    ];
    abilitiesToFilter = abilities.filter(c => abilitiesList.includes(c));

    statFilter = [
      el("stat").value,
      el("operator").value,
      el("statvalue").value || ""
    ];

    calculations();
  };
}

function sortTable(column) {
  if (sorted === column) makeTable(data.reverse());
  else {
    sorted = column;
    data.sort((card1, card2) => card1[column] > card2[column]);
    makeTable(data);
  }
}

function download() {
  let dataCSV = data.reduce(
    (p, c) => `${p}${c.card},${c.mana},${c.health},${c.armor},${c.speed},`
      + `${c.attack},${c.ranged},${c.magic},${c.abilities}\n`,
    "card,mana,health,armor,speed,attack,ranged,magic,abilities\n"
  );

  let csv_text = document.createElement('a');
  csv_text.setAttribute('href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(dataCSV));

  let d = new Date();
  let date_string = d.getFullYear().toString()
    + d.getDate().toString()
    + d.getHours().toString()
    + d.getSeconds().toString();
  let descriptor = league + rarities[summoner] + date_string;
  csv_text.setAttribute('download', `${descriptor}.csv`);

  csv_text.style.display = 'none';
  document.body.appendChild(csv_text);
  csv_text.click();
  document.body.removeChild(csv_text);
}
