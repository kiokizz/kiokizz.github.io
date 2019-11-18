var body1 = "Data regarding the remaining reward edition cards for Splinterlands.<br>"

document.getElementById("body1").innerHTML = body1;

var body2 =
    "Disclaimer: Human error could result in mistakes in the representation of the above data; no waranty express or implied is provided. Extracted from https://steemmonsters.com/cards/get_details.<br>" +
    "<br><a href=\"https://github.com/kiokizz\">GitHub</a> | Check out my Steem blogs <a href=\"https://www.steemit.com/@kiokizz\">@kiokizz</a> & <a href=\"https://www.steemit.com/@kiobot\">@kiobot</a>"

document.getElementById("body2").innerHTML = body2;

getRewardCards();

function getRewardCards() {

    let url = "https://steemmonsters.com/cards/get_details";

    $.get(url, url, function (data) {
        console.log(data);

        let rewardCards = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const e = data[i];
                if (e.editions === "3") rewardCards.push(e);
            }
        }
        calculations(rewardCards);
    });
}

let data = [];
let sorted = {};

function calculations(rewardCards) {
    let cardCap = [0, 400000, 100000, 40000, 10000]
    let xp = [0, 15, 75, 175, 750];
    let gxp = [0, 200, 400, 800, 2000];
    let rarities = {
        1: "Common",
        2: "Rare",
        3: "Epic",
        4: "Legendary"
    }

    for (let i = 0; i < rewardCards.length; i++) {
        //Stat data
        let c = {}
        let e = rewardCards[i];

        c.card = e.name;
        c.rarity = rarities[e.rarity];
        c.bcxNormExist = parseInt(e.distribution[0].total_xp) / xp[e.rarity] + parseInt(e.distribution[0]
            .num_cards);
        c.bcxGoldExist = parseInt(e.distribution[1].total_xp) / gxp[e.rarity];
        c.bcxExist = c.bcxNormExist + c.bcxGoldExist;
        c.nBCXBurn = parseInt(e.distribution[0].total_burned_xp) / xp[e.rarity] + parseInt(e.distribution[0]
            .num_burned);
        c.gBCXBurn = parseInt(e.distribution[1].total_burned_xp) / gxp[e.rarity];
        c.bcxBurn = c.nBCXBurn + c.gBCXBurn;
        c.bcxTotal = e.total_printed;
        c.yBCXTotal = c.bcxExist + c.bcxBurn;
        c.bcxPercent = parseFloat(e.total_printed / cardCap[e.rarity] * 100).toFixed(2) + "%";

        //CSS Requirements
        c.color = e.color;

        data.push(c);
    }

    makeTable(data);
}

function makeTable(data) {
    let header =
        "<table><tr><th><button id=\"card_btn\" class=\"btn\">Card</button><button id=\"color_btn\" class=\"btn\">(color)</button></th>" +
        "<th><button id=\"rarity_btn\" class=\"btn\">Rarity</button></th>" +
        "<th><button id=\"normal_btn\" class=\"btn\">Normal BCX Existing</button></th>" +
        "<th><button id=\"gold_btn\" class=\"btn\">Gold BCX Existing</button></th>" +
        "<th><button id=\"burn_btn\" class=\"btn\">BCX Burned</button></th>" +
        "<th>Total BCX</th>" +
        "<th><button id=\"percent_btn\" class=\"btn\">Percentage Printed</button></th></tr>";

    let rows = "";

    for (let i = 0; i < data.length; i++) {
        //Style
        const e = data[i];

        let cardCss;
        if (e.color === "Black") cardCss = "style=\"background-color:" + e.color + ";color:rgb(201, 201, 201)" +
            "\"";
        else if (e.color === "Blue") cardCss = "style=\"background-color:" + e.color + ";color:white" + "\"";
        else cardCss = "style=\"background-color:" + e.color + "\"";
        let rowData =
            "<tr><td " + cardCss + ">" + e.card + "</td><td>" + e.rarity +
            "</td><td>" + e.bcxNormExist + "</td><td>" + e.bcxGoldExist + "</td><td>" + e.bcxBurn +
            "</td><td>" +
            e.bcxTotal + "</td><td>" + e.bcxPercent + "</td></tr>";

        rows += rowData;
    }

    let footer = "</table>";
    table = header + rows + footer;

    createHTMLPage(table);
}

function createHTMLPage(table) {
    document.getElementById("displayStats").innerHTML = table;

    //Buttons
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
        let line = e.card + "," + e.rarity + "," + e.bcxNormExist + "," + e.bcxGoldExist + "," + e.bcxBurn + "," + e.bcxPercent + "\n";
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