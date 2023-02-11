var body1 = "Data regarding the remaining reward edition cards for Splinterlands.<br>"

document.getElementById("body1").innerHTML = body1;

var body2 =
    "Disclaimer: Human error could result in mistakes in the representation of the above data. Extracted from https://api2.splinterlands.com/cards/get_details.<br>" +
    "<br><a href=\"https://github.com/kiokizz\">GitHub</a> | Check out my blogs <a href=\"https://hive.blog/@kiokizz\">@kiokizz</a> & <a href=\"https://hive.blog/@splinterstats\">@splinterstats</a>"

document.getElementById("body2").innerHTML = body2;

let data = [];
let global = {
  totalNormalBCX: 0,
  totalGoldBCX: 0,
  totalBCX: 0,
  totalNormalBurnt: 0,
  totalGoldBurnt: 0,
  totalBurnt: 0,
  avgPrintRate: [],
  avgBurnRate: [],
  numCardsPrinting: 0,
  numCardsFinished: 0,
  maxNormalSetPrice: 0,
  maxGoldSetPrice: 0
};
let sorted = {};
let rewardCards = [];
let normalPrices = [];
let goldPrices = [];
let hidden = {
  complete: true,
  length: 0
};

getRewardCards();

function getRewardCards() {
  let url = "https://api2.splinterlands.com/cards/get_details";
  $.get(url, url, function (data) {
    console.log(data);
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (["3", "10"].includes(e.editions)) rewardCards.push(e);
      }
    }
    getPrices();
  });
}

function getPrices() {
  let url = "https://api2.splinterlands.com/market/for_sale_grouped";
  $.get(url, url, function (data) {
    console.log(data);
    if (data) {
      rewardCards.forEach((e) => {
        let nTemp = {};
        let gTemp = {};
        data.forEach(ex => {
          if (e.id === ex.card_detail_id && ex.gold === false) {
            nTemp.low_price = ex.low_price;
            nTemp.low_price_bcx = ex.low_price_bcx;
          } else if (e.id === ex.card_detail_id && ex.gold === true) {
            gTemp.low_price = ex.low_price;
            gTemp.low_price_bcx = ex.low_price_bcx;
          }
        });
        normalPrices.push(nTemp);
        goldPrices.push(gTemp);
      });
      console.log(normalPrices);
    }
    calculations();
  });
}

function calculations() {
  let oldCardCap = [0, 400000, 100000, 40000, 10000]
  let newCardCap = [0, 8000000, 2000000, 800000, 200000]
  let betaxp = [0, 15, 75, 175, 750];
  let betagxp = [0, 200, 400, 800, 2000];
  let untamedxp = [0, 1, 1, 1, 1];
  let rarities = {
    1: "Common",
    2: "Rare",
    3: "Epic",
    4: "Legendary"
  }
  let betaCardsToMax = [0, 505, 115, 46, 11];
  let untamedCardsToMax = [0, 400, 115, 46, 11];

  //Card Statistic data
  for (let i = 0; i < rewardCards.length; i++) {
    let c = {}
    let e = rewardCards[i];

    let xp, gxp;
    if (e.id <= 223) xp = betaxp, gxp = betagxp;
    else xp = untamedxp, gxp = untamedxp;

    c.card = e.name;
    c.rarity = rarities[e.rarity];
    c.id = e.id;

    //BCX
    c.bcxGoldExist = 0, c.gBCXBurn = 0, c.bcxNormExist = 0, c.nBCXBurn = 0;
    let distributions = e.distribution;
    distributions.forEach(dist => {
      if (!dist.gold) {
        //Add number of number of cards if Beta Edition; base card not included in total_xp before this edition.
        let addBurntNum = 0;
        let addCardNum = 0;
        if (e.id <= 223) {
          addBurntNum = parseInt(dist.num_burned);
          addCardNum = parseInt(dist.num_cards);
        }
        c.bcxNormExist = parseInt(dist.total_xp) / xp[e.rarity] + addCardNum;
        c.nBCXBurn = parseInt(dist.total_burned_xp) / xp[e.rarity] + addBurntNum;
      } else {
        c.bcxGoldExist = parseInt(dist.total_xp) / gxp[e.rarity];
        c.gBCXBurn = parseInt(dist.total_burned_xp) / gxp[e.rarity];
      }
    })

    c.bcxExist = c.bcxNormExist + c.bcxGoldExist;
    c.bcxBurn = c.nBCXBurn + c.gBCXBurn;
    c.bcxTotal = e.total_printed;
    c.yBCXTotal = c.bcxExist + c.bcxBurn;
    if (e.id < 331) {
      c.complete = e.total_printed / oldCardCap[e.rarity] >= 1;
      c.bcxPercent = parseFloat(e.total_printed / oldCardCap[e.rarity] * 100).toFixed(2) + "%";
    } else if ([331,334,337,340,343,349,].includes(e.id)) {
      c.complete = e.total_printed / newCardCap[e.rarity] >= 1;
      c.bcxPercent = parseFloat(e.total_printed / newCardCap[e.rarity] * 100).toFixed(2) + "%";
    } else if (e.id < 463) {
      c.complete = e.total_printed / newCardCap[e.rarity] >= 1;
      c.bcxPercent = parseFloat(e.total_printed / newCardCap[e.rarity] * 100).toFixed(2) + "% 🚫";
    } else {
      c.complete = false
      c.bcxPercent = "\t⌛"
    }

    if (c.bcxTotal !== c.yBCXTotal) console.log(c.card + " statistics incorrect. API delay possible. Discrepency = " + (c.bcxTotal - c.yBCXTotal));

    //Prices
    if (normalPrices[i].low_price) c.price = normalPrices[i].low_price;
    else c.price = 0;
    if (normalPrices[i].low_price_bcx) c.price_bcx = normalPrices[i].low_price_bcx;
    else c.price_bcx = 0;

    if (goldPrices[i].low_price) c.goldPrice = goldPrices[i].low_price;
    else c.goldPrice = 0;
    if (goldPrices[i].low_price_bcx) c.goldPrice_bcx = goldPrices[i].low_price_bcx;
    else c.goldPrice_bcx = 0;

    //CSS Requirements
    c.color = e.color;

    data.push(c);

    //Global Stats
    global.totalNormalBCX += c.bcxNormExist;
    global.totalGoldBCX += c.bcxGoldExist;
    global.totalBCX += c.bcxTotal;
    global.totalNormalBurnt += c.nBCXBurn;
    global.totalGoldBurnt += c.gBCXBurn;
    global.avgBurnRate.push(c.bcxBurn / c.bcxTotal);
    if (e.id < 331) {
      if (!c.complete) global.avgPrintRate.push(e.total_printed / oldCardCap[e.rarity]);
    } else {
      if (!c.complete) global.avgPrintRate.push(e.total_printed / newCardCap[e.rarity]);
    }
    if (c.complete) global.numCardsFinished++;
    else global.numCardsPrinting++;
    if (e.id <= 223) parseFloat(global.maxNormalSetPrice += c.price_bcx * betaCardsToMax[e.rarity]);
    else global.maxNormalSetPrice += parseFloat(c.price_bcx * untamedCardsToMax[e.rarity]);
    if (e.id <= 223) parseFloat(global.maxGoldSetPrice += c.goldPrice_bcx * betaCardsToMax[e.rarity]);
    else global.maxGoldSetPrice += parseFloat(c.goldPrice_bcx * untamedCardsToMax[e.rarity]);
  }

  //Global Stats Continued...
  function avgRate(arr) {
    let temp = 0;
    arr.forEach(b => {
      temp += b;
    });
    temp = temp / arr.length;
    return (temp * 100).toFixed(2) + "%";
  }

  global.normalPrinted = global.totalNormalBCX + global.totalNormalBurnt;
  global.goldPrinted = global.totalGoldBCX + global.totalGoldBurnt;
  global.avgPrintRate = avgRate(global.avgPrintRate);
  global.avgBurnRate = avgRate(global.avgBurnRate);
  global.normalPercentageBurnt = (global.totalNormalBurnt / global.normalPrinted * 100).toFixed(2);
  global.goldPercentageBurnt = (global.totalGoldBurnt / global.goldPrinted * 100).toFixed(2);
  global.totalBurnt = global.totalNormalBurnt + global.totalGoldBurnt;
  global.totalPercentageBurnt = ((global.totalBurnt / (global.normalPrinted + global.goldPrinted)) * 100).toFixed(2);

  makeTable(data);
}

function makeTable(data) {
  hidden.length = 0;

  //Header
  let header =
      "<table><tr><th><button id=\"card_btn\" class=\"btn\">Card</button><button id=\"color_btn\" class=\"btn\">🌈</button></th>" +
      "<th><button id=\"rarity_btn\" class=\"btn\">Rarity</button></th>" +
      "<th><button id=\"normal_btn\" class=\"btn\">Normal BCX 🔄</button></th>" +
      "<th><button id=\"gold_btn\" class=\"btn\">Gold BCX 🔄</button></th>" +
      "<th><button id=\"burn_btn\" class=\"btn\">BCX 🔥</button></th>" +
      "<th>Total BCX</th>" +
      "<th><button id=\"percent_btn\" class=\"btn\">% Printed</button></th>" +
      "<th><button id=\"price_btn\" class=\"btn\">💰</button></th></tr>";

  //Card Rows
  let rows = "";
  let hiddenString = "";

  for (let i = 0; i < data.length; i++) {
    //Style
    const e = data[i];

    let backgroundColor = {
      Red: "#FF3333",
      Green: "#00CC66",
      White: "#F5F5F5",
      Gray: "#BEBEBE",
      Gold: "#FFCC33",
      Blue: "#00CCFF",
      Black: "#663399"
    }

    let textColor = {
      Red: "black",
      Green: "black",
      White: "black",
      Grey: "black",
      Gold: "black",
      Blue: "black",
      Black: "white"
    }

    let cardCss = "style=\"background-color:" + backgroundColor[e.color] + ";color:" + textColor[e.color] + "\"";

    //https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/Creeping%20Ooze_lv1.png
    let urlName = e.card.replace(/\s/g, "%20");
    let edition_name = "reward";
    if (data[i].id >= 510 ) edition_name = "soulbound";
    let imageLink = `https://d36mxiodymuqjm.cloudfront.net/cards_by_level/${edition_name}/${urlName}_lv1.png`;
    let cardToolTip = "<a class=\"tooltip\">" + e.card + "<span><img style=\"max-width:100%;height:auto;\" src=\"" + imageLink +
        "\"><h3></h3></span></a>";

    let burnedToolTip = "<a class=\"tooltip\">" + e.bcxBurn + "<span  style=\"color:white;width: 205px\">Normal: " + e.nBCXBurn + " | Gold: " + e.gBCXBurn;
    +"<h3></h3></span></a>";
    let priceToolTip = "<a href=\"https://peakmonsters.com/market?card=" + data[i].id + "&edition=reward\"  target=\"_blank\" class=\"tooltip\">" + e.price.toFixed(3) + "<span  style=\"color:white;width: 310px\">Low_BCX: Normal $" + e.price_bcx.toFixed(3) + " | Gold: $" + e.goldPrice_bcx.toFixed(3);
    +"<h3></h3></span></a>";

    if (e.id > 462) {
      priceToolTip = "<a href=\"https://peakmonsters.com/market?card=" + data[i].id + "&edition=reward\"  target=\"_blank\" class=\"tooltip\">-.--" +
          "<span  style=\"color:white;width: 310px\">Not yet marketable.</span></a>";
    }

    let rowData =
        "<tr class=\"trcard\"><td " + cardCss + ">" + cardToolTip + "</td><td class='cell'>" + e.rarity +
        "</td><td class='cell'>" + e.bcxNormExist + "</td><td class='cell'>" + e.bcxGoldExist + "</td><td class='cell'>" + burnedToolTip +
        "</td><td class='cell'>" +
        e.bcxTotal + "</td><td class='cell'>" + e.bcxPercent + "</td><td class='cell'> $" + priceToolTip + "</td></tr>";

    if (hidden.complete && e.id < 463) rowData = "", hidden.length++, hiddenString += " | " + e.card;

    rows += rowData;
  }

  //Footer
  let footer = "";
  if (hidden.complete) footer = "<tr class='cell'><td colspan=\"8\"><button id=\"toggleReveal_btn\" class=\"btnBordered\">Hide / Reveal Complete</button> ... " + hidden.length + " hidden " + hiddenString + "</td></tr>";
  else footer = "<tr><td colspan=\"8\"><button id=\"toggleReveal_btn\" class=\"btnBordered\">Hide / Reveal Complete</button> ... All shown.</td></tr>";

  //Global Stats
  let stats =
      "<table class='cell'>" +
      "<th>Global Rewards Stats 'Beta'</th><th>Normal</th><th>Gold</th><th>Total</th>" +
      "<tr><td>BCX Existing</td><td>" + global.totalNormalBCX + "</td><td>" + global.totalGoldBCX + "</td><td><b>" + (global.totalNormalBCX + global.totalGoldBCX) + "</b></td></tr>" +
      "<tr><td>BCX Burnt</td><td>" + global.totalNormalBurnt + "</td><td>" + global.totalGoldBurnt + "</td><td><b>" + (global.totalNormalBurnt + global.totalGoldBurnt) + "</b></td></tr>" +
      "<tr><td>Total BCX Printed</td><td>" + global.normalPrinted + "</td><td>" + global.goldPrinted + "</td><td><b>" + global.totalBCX + "</b></td></tr>" +
      "<tr><td>Average % Printed (still printing)</td><td>" + "-" + "</td><td>" + "-" + "</td><td>" + global.avgPrintRate + "</td></tr>" +
      "<tr><td>Total % Burnt</td><td>" + global.normalPercentageBurnt + "%</td><td>" + global.goldPercentageBurnt + "%</td><td><b>" + global.totalPercentageBurnt + "%</b></td></tr>" +
      "<tr><td># Cards Still Printing</td><td>" + "-" + "</td><td>" + "-" + "</td><td>" + global.numCardsPrinting + "</td></tr>" +
      "<tr><td># Cards Out of Print</td><td>" + "-" + "</td><td>" + "-" + "</td><td>" + global.numCardsFinished + "</td></tr>" +
      "<tr><td>Approximate Cost of Max Rewards Set</td><td>$" + global.maxNormalSetPrice.toFixed(2) + "</td><td>$" + global.maxGoldSetPrice.toFixed(2) +
      "</td><td><b>$" + (global.maxNormalSetPrice + global.maxGoldSetPrice).toFixed(2) + "</b></td></tr>" +
      "</table>";

  table = header + rows + footer + "</table><br>" + stats;

  createHTMLPage(table);
}

function createHTMLPage(table) {
  document.getElementById("displayStats").innerHTML = table;

  //Sort Buttons
  document.getElementById("card_btn").onclick = function () {
    sortTable("card")
  };
  document.getElementById("color_btn").onclick = function () {
    sortTable("color")
  };
  document.getElementById("rarity_btn").onclick = function () {
    sortTable("rarity")
  };
  document.getElementById("normal_btn").onclick = function () {
    sortTable("bcxNormExist")
  };
  document.getElementById("gold_btn").onclick = function () {
    sortTable("bcxGoldExist")
  };
  document.getElementById("burn_btn").onclick = function () {
    sortTable("bcxBurn")
  };
  document.getElementById("percent_btn").onclick = function () {
    sortTable("bcxPercent")
  };
  document.getElementById("price_btn").onclick = function () {
    sortTable("price")
  };

  //Settings Buttons
  document.getElementById("toggleReveal_btn").onclick = function () {
    hidden.complete = !hidden.complete;
    makeTable(data);
  };
}

function sortTable(column) {
  if (!sorted[column]) sorted[column] = 1;
  else sorted[column] *= -1;
  data.sort(function (a, b) {
    let c = a[column];
    let d = b[column];
    if (column === "bcxPercent") {
      c = c.slice(0, -1);
      d = d.slice(0, -1);
      if (c === "\t⌛") c = 0
      if (d === "\t⌛") d = 0
    }
    if (column === "rarity") {
      c = rarity(c);
      d = rarity(d);

      function rarity(x) {
        let y = 0;
        if (x === "Common") y = 1;
        else if (x === "Rare") y = 2;
        else if (x === "Epic") y = 3;
        else if (x === "Legendary") y = 4;
        return y;
      }
    }
    let letters = ["card", "color", "rarity"]
    if (!letters.includes(column)) {
      c = parseFloat(c);
      d = parseFloat(d);
    }
    if (c > d) {
      return 1 * sorted[column];
    } else {
      return -1 * sorted[column];
    }
  });
  makeTable(data);
}

function download() {
  let dataCSV = `Card,Rarity,Normal BCX Existing,Gold BCX Existing,Normal BCX Burnt,Gold BCX Burnt,Total BCX Burnt,Total BCX,Percentage Printed,Low Price,Low_BCX: Normal,Low_BCX: Gold\n`;
  data.forEach(e => {
    let line = `${e.card},${e.rarity},${e.bcxNormExist},${e.bcxGoldExist},${e.nBCXBurn},${e.gBCXBurn},${e.bcxBurn},${e.bcxTotal},${e.bcxPercent},${e.price},${e.price_bcx.toFixed(3)},${e.goldPrice_bcx.toFixed(3)}\n`;
    dataCSV += line;
  });

  let csvTXT = document.createElement('a');
  csvTXT.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataCSV));

  let d = new Date();
  let descriptor = d.getFullYear().toString() + d.getDate().toString() + d.getHours().toString() + d.getSeconds().toString();
  csvTXT.setAttribute('download', descriptor + ".csv");

  csvTXT.style.display = 'none';
  document.body.appendChild(csvTXT);

  csvTXT.click();

  document.body.removeChild(csvTXT);
}

// Theme
let head_div = document.getElementById("head_div");
let nav_buttons = document.getElementsByClassName("buttons");
const setTheme = function (theme) {
  localStorage.theme = theme;
  console.log(`cooke: ${document.cookie}. Should be ${theme}`)
  head_div.classList.toggle("w3-theme");
  console.log(typeof nav_buttons, nav_buttons)

  for (let i = 0; i < nav_buttons.length; i++) {
    console.log(location.pathname.split("/").pop(), nav_buttons[i].id)
    if (location.pathname.split("/").pop() === nav_buttons[i].id) nav_buttons[i].classList.toggle("w3-theme-d3");
    nav_buttons[i].classList.toggle("w3-text-white")
  }
  document.documentElement.className = theme;
}
if (localStorage.theme === 'dark') setTheme(localStorage.theme);