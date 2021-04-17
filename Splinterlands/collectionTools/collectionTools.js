function data_collector() {
  let context = this;

  let settings, details, collection;

  let rowData = [];
  let sorted = "";

  let editionsToFilter = [];
  let abilitiesToFilter = [];
  let statFilter = ["none"];

  let player, posting_key;
  let keyType = `keychainBegin`;

  this.generate = function () {
    el('generate').disabled = true;
    player = `${el("username").value}`;
    if (!el(`logIn`).checked) context.getSettings();
    else if (keyType === `keychainBegin`) context.keychainBegin();
    else if (keyType === `keyBegin`) context.keyBegin();
    else throw `Error with keyType; ${keyType}`
  }

  this.toggleLogin = function () {
    let checkBox = el("keyType");
    let passwordField = el("password");
    if (checkBox.checked == false) {
      passwordField.style.display = "block";
      keyType = `keyBegin`;
    } else {
      passwordField.style.display = "none";
      keyType = `keychainBegin`;
    }
  }

  this.keychainBegin = function () {
    console.log(`Loggin in with Hive Keychain.`);
    if (window.hive_keychain) {
      hive_keychain.requestHandshake(function () {
        update_status(`Hive-Keychain Connected`);
        hive_keychain.requestEncodeMessage(
          `${player}`,
          `splinterstats`,
          `#SplinterStatsReportCard`,
          `Posting`,
          function (response) {
            if (response.success) {
              update_status(`Account Verified`);
              context.getSettings();
            } else stop_on_error(`Please ensure you have the Posting Key for @${player} in Hive Keychain and refresh the page.`);
          }
        );
      });
    } else stop_on_error(`Please log-in to, or install, Hive Keychain`);
  }

  this.keyBegin = function () {
    console.log("Logging in with private key.");
    posting_key = `${el("password").value}`;
    //encode message
    hive.api.getAccounts([player], function (err, result) {
      let pubWif = result[0].posting.key_auths[0][0];
      let isvalid;
      //console.log(err, result);
      try {
        isvalid = hive.auth.wifIsValid(posting_key, pubWif);
      } catch (e) {
        isvalid = 'false';
      }
      if (isvalid == true) {
        update_status(`Posting Key Validated.`);
        context.getSettings();
      } else {
        stop_on_error(`Please ensure you have the Posting Key for @${player} and refresh the page.`);
      }
    });
  }

  this.getSettings = function () {
    update_status(`Getting Splinterlands settings.`);
    let url = `https://game-api.splinterlands.com/settings`;
    request(url, 0, context.getDetails);
  }

  this.getDetails = function (data) {
    settings = data;
    console.log(`Settings:`, settings);
    update_status(`Getting global card details.`);
    let url = `https://game-api.splinterlands.com/cards/get_details`;
    request(url, 0, context.getCollection);
  }

  this.getCollection = function (data) {
    details = {};
    data.forEach(card => {
      details[card.id] = card;
    });
    console.log(`Card Details:`, details);
    update_status(`Getting ${player}'s collection.`);
    let url = `https://game-api.splinterlands.com/cards/collection/${player}`;
    request(url, 0, context.sortData);
  }

  this.sortData = function (data) {
    collection = data.cards;
    console.log(`Collection Details:`, collection);

    rowData = [];
    sorted = "";

    collection.forEach((card, i) => {
      update_status(`Card ${i}/${collection.length}`);

      let id = card.card_detail_id;
      let obj;

      if (details[id][`type`] == `Summoner`) {
        obj = {
          mana: details[id]["stats"].mana,
          health: details[id]["stats"].health,
          armor: details[id]["stats"].armor,
          speed: details[id]["stats"].speed,
          attack: details[id]["stats"].attack,
          ranged: details[id]["stats"].ranged,
          magic: details[id]["stats"].magic
        };
      } else {
        obj = {
          mana: details[id]["stats"].mana[card.level - 1],
          health: details[id]["stats"].health[card.level - 1],
          armor: details[id]["stats"].armor[card.level - 1],
          speed: details[id]["stats"].speed[card.level - 1],
          attack: details[id]["stats"].attack[card.level - 1],
          ranged: details[id]["stats"].ranged[card.level - 1],
          magic: details[id]["stats"].magic[card.level - 1]
        };
      }

      obj.level = card.level;
      obj.card = details[id].name;
      obj.color = details[id].color;
      obj.gold = card.gold;
      obj.uid = card.uid;
      obj.delegated_to = (card.delegated_to !== null && card.delegated_to !== player) ? card.delegated_to : ``;
      obj.owner = (card.delegated_to === player) ? card.player : ``;

      let rarities = {
        1: "Common",
        2: "Rare",
        3: "Epic",
        4: "Legendary"
      };
      obj.rarity = rarities[details[id].rarity];

      let editions = {
        "0": "alpha",
        "1": "beta",
        "2": "promo",
        "3": "reward",
        "4": "untamed",
        "5": "dice",

      };
      obj.edition = editions[card["edition"]];

      let tiers = {
        null: `null`,
        2: `Beta`,
        4: `Untamed`,
        6: `Chaos`
      }
      obj.tier = (details[id].tier !== null) ? tiers[details[id].tier] : ``;

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

      rowData.push(obj);
    });
    console.log(`Row Data`, rowData);
    context.makeTable();
  }

  this.makeTable = function () {
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

    let rows = rowData.reduce((p, c) => {
        let style = `style="background-color:${backgroundColor[c.color]}; color: ${textColor[c.color]}"`;

        //https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/Creeping%20Ooze_lv1.png
        let urlName = c.card.replace(/\s/g, "%20");
        let level = (c.level);
        let imageLink = `https://d36mxiodymuqjm.cloudfront.net/cards_by_level/${c.edition}/${urlName}_lv${level}${c.gold ? `_gold` : ``}.png`;
        let tool_tip = `
<a class="tooltip">${c.card}<span>
   <img style="max-width:100%;height:auto;" src="${imageLink}" alt="">
</span></a>`;

        return `${p}
<tr>
  <td> <input type="checkbox" id="${c.uid}" style="width: 25px; height: 25px;" onclick=""></td>
  <td ${style}> ⭐<b>${level}</b> | ${tool_tip}</td>
  <td>${c.mana}</td><td>${c.health}</td><td>${c.armor}</td>
  <td>${c.speed}</td><td>${c.attack}</td><td>${c.ranged}</td>
  <td>${c.magic}</td>
</tr>`;
      },
      "");

    let table = `
<table>
  <tr>
  <th>✅</th>
    <th>
      <button id="card" class="btn">Card</button>
      <button id="color" class="btn">🌈</button>
    </th>
    <th><button id="mana" class="btn">🔮 Mana</button></th>
    <th><button id="health" class="btn">💗 Health</button></th>
    <th><button id="armor" class="btn">🛡️ Armor</button></th>
    <th><button id="speed" class="btn">⏩ Speed</button></th>
    <th><button id="attack" class="btn">🗡️ Melee</button></th>
    <th><button id="ranged" class="btn">🏹 Ranged</button></th>
    <th><button id="magic" class="btn">✨ Magic</button></th>
  </tr>
  ${rows}
</table>`;

    context.createHTMLPage(table);
  }

  this.createHTMLPage = function (table) {
    el("content").innerHTML = table;
    ['color', 'card', 'mana', 'health', 'armor', 'speed', 'attack', 'ranged', 'magic']
    .forEach(column_name => el(column_name).onclick = () => sortTable(column_name));

    let CSVs = document.getElementsByClassName("CSV");
    Array.from(CSVs).map(c => c.style.display = "block");
  }

  function sortTable(column) {
    if (sorted === column) context.makeTable(rowData.reverse());
    else {
      sorted = column;
      rowData.sort((card1, card2) => {
        if (card1[column] < card2[column]) return -1;
        if (card1[column] > card2[column]) return 1;
        return 0;
      });
      context.makeTable(rowData);
    }
  }

  this.download = function () {
    let dataCSV = rowData.reduce(
      (p, c) => `${p}${c.uid},${c.level},${c.card},${c.edition},${c.tier},${c.rarity},${c.color},${c.owner},${c.delegated_to},${c.mana},${c.health},${c.armor},${c.speed},` +
      `${c.attack},${c.ranged},${c.magic}\n`,
      "uid,level,card,edition,sub-edition,rarity,splinter,owner,delegated_out,mana,health,armor,speed,attack,ranged,magic\n"
    );

    let csv_text = document.createElement('a');
    csv_text.setAttribute('href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(dataCSV));

    let d = new Date();
    let date_string = d.getFullYear().toString() +
      d.getDate().toString() +
      d.getHours().toString() +
      d.getSeconds().toString();
    let descriptor = `${player}-${date_string}`;
    csv_text.setAttribute('download', `${descriptor}.csv`);

    csv_text.style.display = 'none';
    document.body.appendChild(csv_text);
    csv_text.click();
    document.body.removeChild(csv_text);
  }
}