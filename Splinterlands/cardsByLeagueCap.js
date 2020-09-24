var body2 = "Disclaimer: Human error could result in mistakes in the representation of the above data. Extracted from https://game-api.splinterlands.com/cards/get_details.<br>" +
    "<br><a href=\"https://github.com/kiokizz\">GitHub</a> | Check out my blogs <a href=\"https://hive.blog/@kiokizz\">@kiokizz</a> & <a href=\"https://hive.blog/@splinterstats\">@splinterstats</a>"

document.getElementById("body2").innerHTML = body2;

let data = [];
let cards = [];
let sorted = {};

let league = "bronze";
let summoner = 2;
let abilitiesList = [];
let editionsToFilter = [];
let abilitiesToFilter = [];
let statFilter = ["none"]

let rarities = {
    1: "Common",
    2: "Rare",
    3: "Epic",
    4: "Legendary"
}

let leageCaps = {
    novice: [1, 1, 1, 1],
    bronze: [3, 2, 2, 1],
    silver: [5, 4, 3, 2],
    gold: [8, 6, 5, 3],
    diamond: [10, 8, 6, 4],
    champion: this.diamond
}

let summonerCaps = {
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
}

getcards();

function getcards() {

    let url = "https://game-api.splinterlands.com/cards/get_details";

    $.get(url, url, function (data) {
        cards = data;
        console.log(data);
        calculations();
    });
}

function calculations() {
    data = [];
    sorted = {};

    // League && Rarity --> Summoner Level --> Monster Level
    let thisLeague = leageCaps[league];
    let summonerLevel = thisLeague[summoner - 1];
    let summonersCap = summonerCaps[rarities[summoner]];
    let levelCaps = summonersCap[summonerLevel];

    console.log(summoner, league, summonerCaps);

    for (let i = 0; i < cards.length; i++) {
        let c = {}
        const e = cards[i];

        c.level = levelCaps[e.rarity - 1] - 1;
        if (league == "novice" && summoner !== 1) c.level = 0;

        //console.log(i," Summoner Level: ", summonerLevel, " - Card Level ", c.level, " - Name: ", e.name)

        if (e.type === "Monster") {
            c.card = e.name
            c.mana = e.stats.mana[c.level];
            c.health = e.stats.health[c.level];
            c.armor = e.stats.armor[c.level];
            c.speed = e.stats.speed[c.level];
            c.attack = e.stats.attack[c.level];
            c.ranged = e.stats.ranged[c.level];
            c.magic = e.stats.magic[c.level];
            c.abilities = "";
            for (let ii = 0; ii <= c.level; ii++) {
                if (e.stats.abilities[ii].length > 0) {
                    if (c.abilities.length > 0) c.abilities += ",";
                    c.abilities += e.stats.abilities[ii];
                }
            }
            c.abilitiesArray = c.abilities.split(",");
            c.abilitiesArray.forEach(e => {
                if (!abilitiesList.includes(e)) abilitiesList.push(e);
            });
            c.abilities = c.abilities.replace(",", ", ")
            if (e.editions === "0,1" || "1") c.edition = "beta";
            if (e.editions === "2") c.edition = "promo";
            if (e.editions === "3") c.edition = "reward";
            if (e.editions === "4") c.edition = "untamed";
            if (e.editions === "5") c.edition = "dice";
            //CSS Requirements
            c.color = e.color;
        } else if (e.type === "Summoner") {
            continue;
        } else throw "error";

        //ToList Abilities
        let toList = true;
        if (c.level < 0) toList = false, console.log(`Level Error`);
        if (abilitiesToFilter.length === 1) {
            toList = false;
            if (c.abilitiesArray.includes(abilitiesToFilter[0])) toList = true;
        } else if (abilitiesToFilter.length === 2) {
            toList = false;
            let a0 = (c.abilitiesArray.includes(abilitiesToFilter[0]));
            let a1 = (c.abilitiesArray.includes(abilitiesToFilter[1]));
            if (a0 && a1) toList = true;
        } else if (abilitiesToFilter.length === 3) {
            toList = false;
            let a0 = (c.abilitiesArray.includes(abilitiesToFilter[0]));
            let a1 = (c.abilitiesArray.includes(abilitiesToFilter[1]));
            let a2 = (c.abilitiesArray.includes(abilitiesToFilter[2]));
            if (a0 && a1 && a2) toList = true;
        }

        //ToList Edition
        if (editionsToFilter.length >= 1 && !editionsToFilter.includes(c.edition)) toList = false;

        //ToList Stat
        let statFilterCheck;
        if (statFilter[1] === "<") statFilterCheck = (c[statFilter[0]] < statFilter[2]);
        else if (statFilter[1] === ">") statFilterCheck = (c[statFilter[0]] > statFilter[2]);
        else if (statFilter[1] === "=") statFilterCheck = (c[statFilter[0]] == statFilter[2]);

        if (statFilter[0] !== "none" && !statFilterCheck) toList = false;

        if (toList) data.push(c);
    }
    makeTable();
}

function makeTable() {
    let header =
        //mana | health | armor | speed| attack | ranged | magic | abilities
        "<table><tr><th><button id=\"card_btn\" class=\"btn\">" + league + "|" + rarities[summoner] + "</button><button id=\"color_btn\" class=\"btn\">🌈</button>" +
        "<th><button id=\"mana_btn\" class=\"btn\">🔮 Mana</button></th>" +
        "<th><button id=\"health_btn\" class=\"btn\">💗 Health</button></th>" +
        "<th><button id=\"armor_btn\" class=\"btn\">🛡️ Armor</button></th>" +
        "<th><button id=\"speed_btn\" class=\"btn\">⏩ Speed</button></th>" +
        "<th><button id=\"attack_btn\" class=\"btn\">🗡️ Melee</button></th>" +
        "<th><button id=\"ranged_btn\" class=\"btn\">🏹 Ranged</button></th>" +
        "<th><button id=\"magic_btn\" class=\"btn\">✨ Magic</button></th>" +
        "<th>Abilities</th></tr>";

    let rows = "";

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

    for (let i = 0; i < data.length; i++) {
        const e = data[i];

        //Style
        let cardCss = "style=\"background-color:" + backgroundColor[e.color] + ";" + +textColor[e.color] + "\"";

        let level = (e.level + 1);

        //https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/Creeping%20Ooze_lv1.png
        let urlName = e.card.replace(/\s/g, "%20");
        let imageLink = "https://d36mxiodymuqjm.cloudfront.net/cards_by_level/" + e.edition + "/" + urlName + "_lv" + level + ".png";
        let cardToolTip = "<a class=\"tooltip\">" + e.card + "<span><img style=\"max-width:100%;height:auto;\" src=\"" + imageLink +
            "\"><h3></h3></span></a>";

        let rowData =
            "<tr><td " + cardCss + "> ⭐<b>" + level + "</b> | " + cardToolTip + "</td><td>" + e.mana +
            "</td><td>" + e.health + "</td><td>" + e.armor + "</td><td>" + e.speed +
            "</td><td>" +
            e.attack + "</td><td>" + e.ranged + "</td><td>" + e.magic + "</td><td>" + e.abilities + "</td></tr>";

        rows += rowData;
    }

    let footer = "</table>";
    table = header + rows + footer;

    let options = "";
    abilitiesList.forEach(e => {
        options += `<option value="${e}">`;
    });
    document.getElementById('abilities').innerHTML = options;

    createHTMLPage(table);
}

function createHTMLPage(table) {
    document.getElementById("displayStats").innerHTML = table;

    //Buttons
    document.getElementById("color_btn").onclick = function () {
        sortTable("color")
    };
    document.getElementById("card_btn").onclick = function () {
        sortTable("card")
    };
    document.getElementById("mana_btn").onclick = function () {
        sortTable("mana")
    };
    document.getElementById("health_btn").onclick = function () {
        sortTable("health")
    };
    document.getElementById("armor_btn").onclick = function () {
        sortTable("armor")
    };
    document.getElementById("speed_btn").onclick = function () {
        sortTable("speed")
    };
    document.getElementById("attack_btn").onclick = function () {
        sortTable("attack")
    };
    document.getElementById("ranged_btn").onclick = function () {
        sortTable("ranged")
    };
    document.getElementById("magic_btn").onclick = function () {
        sortTable("magic")
    };

    document.getElementById("selectorsFilter").onclick = function () {
        let a = document.getElementById("Summoner")
        let b = a.options[a.selectedIndex].value;
        let c = document.getElementById("League");
        let d = c.options[c.selectedIndex].value;

        summoner = parseInt(b);
        league = d;

        let betaSelector = document.getElementById("beta").checked;
        let promoSelector = document.getElementById("promo").checked;
        let rewardSelector = document.getElementById("reward").checked;
        let untamedSelector = document.getElementById("untamed").checked;
        let diceSelector = document.getElementById("dice").checked;

        editionsToFilter = [];

        if (betaSelector) editionsToFilter.push('beta');
        if (promoSelector) editionsToFilter.push('promo');
        if (rewardSelector) editionsToFilter.push('reward');
        if (untamedSelector) editionsToFilter.push('untamed');
        if (diceSelector) editionsToFilter.push('dice');

        let a1 = document.getElementById("ability1");
        let ability1 = a1.value;
        let a2 = document.getElementById("ability2");
        let ability2 = a2.value;
        let a3 = document.getElementById("ability3");
        let ability3 = a3.value;

        abilitiesToFilter = [];

        if (ability1 != "" && abilitiesList.includes(ability1)) abilitiesToFilter.push(ability1);
        if (ability2 != "" && abilitiesList.includes(ability2)) abilitiesToFilter.push(ability2);
        if (ability3 != "" && abilitiesList.includes(ability3)) abilitiesToFilter.push(ability3);

        let stat = document.getElementById("stat").value;
        let operator = document.getElementById("operator").value;
        let text = document.getElementById("statvalue").value;

        statFilter = [stat, operator, text]

        calculations();
    };

    var x = document.getElementsByClassName("selectors");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "inline-block";
    }

    var x = document.getElementsByClassName("CSV");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "block";
    }
}

function sortTable(column) {
    if (!sorted[column]) sorted[column] = 1;
    else sorted[column] *= -1;
    data.sort(function (a, b) {
        let c = a[column];
        let d = b[column];
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
    let dataCSV = "card,mana,health,armor,speed,attack,ranged,magic,abilities\n";
    data.forEach(e => {
        let line = e.card + "," + e.mana + "," + e.health + "," + e.armor + "," + e.speed + "," + e.attack + "," + e.ranged + "," + e.magic + "," + e.abilities + "\n";
        dataCSV += line;
    });

    let csvTXT = document.createElement('a');
    csvTXT.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataCSV));

    let d = new Date();
    let descriptor = league + rarities[summoner] + d.getFullYear().toString() + d.getDate().toString() + d.getHours().toString() + d.getSeconds().toString();
    csvTXT.setAttribute('download', descriptor + ".csv");

    csvTXT.style.display = 'none';
    document.body.appendChild(csvTXT);

    csvTXT.click();

    document.body.removeChild(csvTXT);
}