let data = {
  monsters: [],
  summoners: [],
  listeners: false
};
let cards = [];
let sorted = "";

let league = "bronze";
let summoner = 2;
let abilitiesList = [];
let editionsToFilter = [];
let abilitiesToFilter = [];
let statFilter = ["none"];

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

let thisLeague;
let summonerLevel;
let summonersCap;
let levelCaps;

const rarities = {
  1: "Common",
  2: "Rare",
  3: "Epic",
  4: "Legendary"
};

let editions = {
  "0,1": "beta",
  "1": "beta",
  "2": "promo",
  "3": "reward",
  "4": "untamed",
  "5": "dice",
  "6": "gladius",
  "7": "chaos"
};

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

function getCards() {
  let url = "https://api2.splinterlands.com/cards/get_details";

  $.get(url, function (returned_data) {
    cards = returned_data;
    console.log(returned_data);
    calculations();
  });
}

function calculations() {
  data = {
    monsters: [],
    summoners: [],
    listeners: data.listeners
  };
  sorted = "";

  summoner = parseInt(el("Summoner").value);
  league = el("League").value;

  const additionFilters = ["beta", "promo", "reward", "untamed", "dice", "gladius", "chaos"];
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

  // League && Rarity --> Summoner Level --> Monster Level
  thisLeague = leageCaps[league];
  summonerLevel = thisLeague[summoner - 1];
  summonersCap = summonerCaps[rarities[summoner]];
  levelCaps = summonersCap[summonerLevel];

  monsters_array();
  summoner_array();

  makeTable();
}

function monsters_array() {
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
      color: card.color,
      rarity: card.rarity,
      type: `monster`
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


    obj.edition = editions[card["editions"]];

    //Filters
    let fail = !abilitiesToFilter
        .reduce((p, c) => p && obj.abilitiesArray.includes(c), true);
    if (fail) return;

    //ToList Edition
    fail = editionsToFilter.length >= 1 &&
        !editionsToFilter.includes(obj.edition);
    if (fail) return;

    //ToList Stat
    let filter =
        (statFilter[1] === "<") ? (a, b) => a < b :
            (statFilter[1] === ">") ? (a, b) => a > b : (a, b) => a === b;

    fail = statFilter[0] !== "none" && statFilter[2] &&
        !filter(obj[statFilter[0]], parseInt(statFilter[2]));
    if (fail) return;

    data.monsters.push(obj);
  });
}

function summoner_array() {
  cards.forEach(card => {
        if (card.type !== "Summoner") return;

        let level = (league === "novice" && summoner !== 1) ?
            0 : levelCaps[card.rarity - 1] - 1;

        let obj = {
          level: level,
          card: card.name,
          mana: card["stats"].mana,
          health: card["stats"].health,
          armor: card["stats"].armor,
          speed: card["stats"].speed,
          attack: card["stats"].attack,
          ranged: card["stats"].ranged,
          magic: card["stats"].magic,
          abilities: "",
          color: card.color,
          rarity: card.rarity,
          type: `summoner`
        };

        // console.log(card)
        // console.log(obj)

        if (card.stats.abilities) {
          obj.abilitiesArray = card["stats"].abilities

          obj.abilities = obj.abilitiesArray.toString();
          obj.abilitiesArray
              .filter(c => c !== "" && !abilitiesList.includes(c))
              .map(c => abilitiesList.push(c));
          obj.abilities = obj.abilities.replace(",", ", ");
        }

        obj.edition = editions[card["editions"]];

        // ToList Edition
        fail = editionsToFilter.length >= 1 &&
            !editionsToFilter.includes(obj.edition);
        if (fail) return;

        data.summoners.push(obj);
      }
  )
  console.log(data.summoners);
}

function makeTable() {
  data.gallery = {
    monster: [],
    summoner: []
  };

  function generate_table_rows(array_cards) {
    return array_cards.reduce((p, c) => {
          let style = `style="background-color:${backgroundColor[c.color]}; color: ${textColor[c.color]}"`;

          //https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/Creeping%20Ooze_lv1.png
          let urlName = c.card.replace(/\s/g, "%20");
          let level = (c.level + 1);
          let imageLink = `https://d36mxiodymuqjm.cloudfront.net/cards_by_level/${c.edition}/${urlName}_lv${level}.png`;
          data.gallery[c.type].push(imageLink);
          let tool_tip = `
            <a class="tooltip">${c.card}<span>
               <img style="max-width:100%;height:auto;" src="${imageLink}" alt="">
            </span></a>`;

          return `${p}
            <tr>
              <td ${style}> ⭐<b>${level}</b> | ${tool_tip}</td>
              <td class="ct">${c.mana}</td>
              <td class="ct">${c.health}</td>
              <td class="ct">${c.armor}</td>
              <td class="ct">${c.speed}</td>
              <td class="ct">${c.attack}</td>
              <td class="ct">${c.ranged}</td>
              <td class="ct">${c.magic}</td>
              <td class="ct">${c.abilities}</td>
            </tr>`;
        },
        "");
  }

  data.monster_rows = generate_table_rows(data.monsters);
  data.summoner_rows = generate_table_rows(data.summoners);

  let tables = {};

  tables.monsters =
      `<table>
        <th colspan="9" style="font-size: large">Monsters</th>
        <tr>
          <th>
            <button id="card" class="btn">${league}|${rarities[summoner]}</button>
            <button id="color" class="btn">🌈</button>
          </th>
          <th><button id="mana" class="btn">🔮 Mana</button></th>
          <th><button id="health" class="btn">💗 Health</button></th>
          <th><button id="armor" class="btn">🛡️ Armor</button></th>
          <th><button id="speed" class="btn">⏩ Speed</button></th>
          <th><button id="attack" class="btn">🗡️ Melee</button></th>
          <th><button id="ranged" class="btn">🏹 Ranged</button></th>
          <th><button id="magic" class="btn">✨ Magic</button></th>
          <th>Abilities</th>
        </tr>
        ${data.monster_rows}
      </table>`;

  el('abilities').innerHTML =
      abilitiesList.reduce((p, c) => `${p}<option value="${c}">`);

  tables.summoners =
      `<table>
        <th colspan="9" style="font-size: large">Summoners</th>
        <tr>
          <th></th>
          <th>🔮</th>
          <th>💗</th>
          <th>🛡️</th>
          <th>⏩</th>
          <th>🗡️</th>
          <th>🏹</th>
          <th>✨</th>
          <th>Abilities</th>
        </tr>
        ${data.summoner_rows}
      </table>`;

  createHTMLPage(tables);
}

function createHTMLPage(table) {
  el("displayStats").innerHTML = table.monsters;
  if (el("galleryCheckbox").checked)
    galleryView(el("summonersCheckbox").checked);
  else el("displayGallery").innerHTML = "";
  if (el("summonersCheckbox").checked)
    el("displaySummoners").innerHTML = table.summoners;
  else el("displaySummoners").innerHTML = "";

  ['color', 'card', 'mana', 'health', 'armor', 'speed', 'attack', 'ranged', 'magic']
      .forEach(column_name => el(column_name).onclick = () => sortTable(column_name));

  el("selectors").style.display = "inline-block";

  let CSVs = document.getElementsByClassName("CSV");
  Array.from(CSVs).map(c => c.style.display = "block");

  if (!data.listeners) {
    console.error(`EVENT LISTENERS ADDED.`)
    console.log(`Add listensers`);
    data.listeners = true;

    let fields_change = [`Summoner`, `League`, `beta`, `promo`, `reward`, `untamed`, `dice`, `gladius`, `chaos`, `ability1`,
      `ability2`, `ability3`, `stat`, `operator`, `statvalue`, `summonersCheckbox`, `galleryCheckbox`]
    fields_change.forEach((field) => el(field).onchange = () => calculations());

    let fields_keyup = [`ability1`, `ability2`, `ability3`];
    fields_change.forEach((field) => el(field).onkeyup = () => calculations());
  }
}

function galleryView(summoner_images) {
  console.log(`Creating gallery from ${data.gallery.monster.length} monster images & ${data.gallery.summoner.length} summoner images.`);
  let gallery = ``;

  if (summoner_images) {
    gallery += data.gallery.summoner.reduce((p, c) => {
      return `${p}
   <img src="${c}" alt="">`
    }, "<p style='font-size: large'>Summoners</p>")
    gallery += `<br><br>`;
  }

  gallery += data.gallery.monster.reduce((p, c) => {
    return `${p}
   <img src="${c}" alt="">`
  }, "<p style='font-size: large'>Monsters</p>")

  el("displayGallery").innerHTML = gallery;
}

function sortTable(column) {
  if (sorted === column) makeTable(data.monsters.reverse());
  else {
    sorted = column;
    data.monster_rows.sort((card1, card2) => {
      if (card1[column] < card2[column]) return -1;
      if (card1[column] > card2[column]) return 1;
      return 0;
    });
    makeTable();
  }
}

function download() {
  let dataCSV = data.monsters.reduce(
      (p, c) => `${p}${c.card},${rarities[c.rarity]},${c.color},${c.edition},${c.level + 1},${c.mana},${c.health},${c.armor},${c.speed},` +
          `${c.attack},${c.ranged},${c.magic},${c.abilities}\n`,
      "card,rarity,color,edition,level,mana,health,armor,speed,attack,ranged,magic,abilities\n"
  );

  let csv_text = document.createElement('a');
  csv_text.setAttribute('href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(dataCSV));

  let d = new Date();
  let date_string = d.getFullYear().toString() +
      d.getDate().toString() +
      d.getHours().toString() +
      d.getSeconds().toString();
  let descriptor = league + rarities[summoner] + date_string;
  csv_text.setAttribute('download', `${descriptor}.csv`);

  csv_text.style.display = 'none';
  document.body.appendChild(csv_text);
  csv_text.click();
  document.body.removeChild(csv_text);
}