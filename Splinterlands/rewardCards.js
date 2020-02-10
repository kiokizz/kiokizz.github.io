var body1 = "Data regarding the remaining reward edition cards for Splinterlands.<br>"

document.getElementById("body1").innerHTML = body1;

var body2 =
    "Disclaimer: Human error could result in mistakes in the representation of the above data. Extracted from https://steemmonsters.com/cards/get_details.<br>" +
    "<br><a href=\"https://github.com/kiokizz\">GitHub</a> | Check out my Steem blogs <a href=\"https://www.steemit.com/@kiokizz\">@kiokizz</a> & <a href=\"https://www.steemit.com/@kiobot\">@kiobot</a>"

document.getElementById("body2").innerHTML = body2;

let data = [];
let sorted = {};
let rewardCards = [];
let prices = [];
let hidden = {
    complete: true,
    length: 0
};

getRewardCards();

function getRewardCards() {
    let url = "https://steemmonsters.com/cards/get_details";
    $.get(url, url, function (data) {
        console.log(data);
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const e = data[i];
                if (e.editions === "3") rewardCards.push(e);
            }
        }
        getPrices();
    });
}

function getPrices() {
    let url = "https://steemmonsters.com/market/for_sale_grouped";
    $.get(url, url, function (data) {
        console.log(data);
        if (data) {
            rewardCards.forEach((e) => {
                let temp = {};
                data.forEach(ex => {
                    if (e.id === ex.card_detail_id && ex.gold === false) {
                        temp.low_price = ex.low_price;
                        temp.low_price_bcx = ex.low_price_bcx;
                    }
                });
                prices.push(temp);
            });
            console.log(prices);
        }
        calculations();
    });
}



function calculations() {
    let cardCap = [0, 400000, 100000, 40000, 10000]
    let betaxp = [0, 15, 75, 175, 750];
    let betagxp = [0, 200, 400, 800, 2000];
    let untamedxp = [1,1,1,1];
    let rarities = {
        1: "Common",
        2: "Rare",
        3: "Epic",
        4: "Legendary"
    }

    for (let i = 0; i < rewardCards.length; i++) {
        //Statistic data
        let c = {}
        let e = rewardCards[i];

        let xp, gxp;
        if (e.id <= 223) xp = betaxp, gxp = betagxp;
        else xp = untamedxp, gxp = untamedxp;

        c.card = e.name;
        c.rarity = rarities[e.rarity];

        if (e.distribution[0]) {
            c.bcxNormExist = parseInt(e.distribution[0].total_xp) / xp[e.rarity] + parseInt(e.distribution[0]
                .num_cards);
            c.nBCXBurn = parseInt(e.distribution[0].total_burned_xp) / xp[e.rarity] + parseInt(e.distribution[0]
                .num_burned);
        } else c.bcxNormExist = 0, c.nBCXBurn = 0;
        if (e.distribution[1]) {
            c.bcxGoldExist = parseInt(e.distribution[1].total_xp) / gxp[e.rarity];
            c.gBCXBurn = parseInt(e.distribution[1].total_burned_xp) / gxp[e.rarity];
        } else c.bcxGoldExist = 0, c.gBCXBurn = 0;

        c.bcxExist = c.bcxNormExist + c.bcxGoldExist;
        c.bcxBurn = c.nBCXBurn + c.gBCXBurn;
        c.bcxTotal = e.total_printed;
        c.yBCXTotal = c.bcxExist + c.bcxBurn;
        c.bcxPercent = parseFloat(e.total_printed / cardCap[e.rarity] * 100).toFixed(2) + "%";

        if (prices[i].low_price) c.price = prices[i].low_price;
        else c.price = 0;

        //CSS Requirements
        c.color = e.color;

        data.push(c);
    }

    makeTable(data);
}

function makeTable(data) {
    hidden.length = 0;
    let header =
        "<table><tr><th><button id=\"card_btn\" class=\"btn\">Card</button><button id=\"color_btn\" class=\"btn\">🌈</button></th>" +
        "<th><button id=\"rarity_btn\" class=\"btn\">Rarity</button></th>" +
        "<th><button id=\"normal_btn\" class=\"btn\">Normal BCX 🔄</button></th>" +
        "<th><button id=\"gold_btn\" class=\"btn\">Gold BCX 🔄</button></th>" +
        "<th><button id=\"burn_btn\" class=\"btn\">BCX 🔥</button></th>" +
        "<th>Total BCX</th>" +
        "<th><button id=\"percent_btn\" class=\"btn\">% Printed</button></th>" +
        "<th><button id=\"price_btn\" class=\"btn\">💰</button></th></tr>";

    let rows = "";
    let hiddenString = "";

    for (let i = 0; i < data.length; i++) {
        //Style
        const e = data[i];

        let backgroundColor = {
            Red: "#FF3333",
            Green: "#00CC66",
            White: "#E8E8E8",
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
        let imageLink = "https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/" + urlName + "_lv1.png";
        let cardToolTip = "<a class=\"tooltip\">" + e.card + "<span><img style=\"max-width:100%;height:auto;\" src=\"" + imageLink +
            "\"><h3></h3></span></a>";

        let rowData =
            "<tr class=\"trcard\"><td " + cardCss + ">" + cardToolTip + "</td><td>" + e.rarity +
            "</td><td>" + e.bcxNormExist + "</td><td>" + e.bcxGoldExist + "</td><td>" + e.bcxBurn +
            "</td><td>" +
            e.bcxTotal + "</td><td>" + e.bcxPercent + "</td><td> $" + e.price.toFixed(3); + "</td></tr>";

        if (hidden.complete && e.bcxPercent.slice(0, -1) >= 100) rowData = "", hidden.length++, hiddenString += " | " + e.card;

        rows += rowData;
    }

    let footer = "";
    if (hidden.complete) footer = "<tr><td colspan=\"8\"><button id=\"toggleReveal_btn\" class=\"btnBordered\">Hide / Reveal Complete</button> ... " + hidden.length + " hidden " + hiddenString + "</td></tr>";
    else footer = "<tr><td colspan=\"8\"><button id=\"toggleReveal_btn\" class=\"btnBordered\">Hide / Reveal Complete</button> ... All shown.</td></tr>";

    table = header + rows + footer + "</table>";

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
    let dataCSV = "";
    data.forEach(e => {
        let line = e.card + "," + e.rarity + "," + e.bcxNormExist + "," + e.bcxGoldExist + "," + e.bcxBurn + "," + e.bcxPercent + "," + e.price + "\n";
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