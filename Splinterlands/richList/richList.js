function data_collector() {
  let context = this;
  let rowData = {};

  let types_names = {
    DEC: "DEC",
    SPS: "Liquid SPS",
    SPSP: "Staked SPS",
    SPSTOTAL: "Total SPS",
    COLLECTION_POWER: "Collection Power",
    CREDITS: "Credits",
    ALPHA: "ALPHA",
    BETA: "BETA",
    UNTAMED: "UNTAMED",
    ORB: "ORB",
    DICE: "DICE",
    LEGENDARY: "Legendary Potion",
    GOLD: "Alchemy Potion",
    PLOT: "Plot Claim",
    TRACT: "Tract Claim",
    REGION: "Region Claim",
    TOTEML: "Legendary Totem",
    TOTEME: "Epic Totem",
    TOTEMR: "Rare Totem",
    TOTEMC: "Common Totem",
    MERITS: "Merits",
    GLADIUS: "GLADIUS",
    BLDSTONE: "Blood Stone",
    PWRSTONE: "Power Stone"
  }

  this.generate = function () {
    el("content").innerHTML = 'Loading...';
    el('generate').disabled = true;

    let query = el('type').value;

    request(`https://api2.splinterlands.com/players/richlist?token_type=${query}`, 0, context.sortData);
  }

  this.sortData = function (data) {
    console.log(`Sort Data....`);
    rowData = data.richlist;
    context.makeTable();
  }

  this.makeTable = function () {
    let header = `<th>#</th><th>Player</th><th>${el('type').value} Balance</th>`;
    let body = ``;

    rowData.forEach((player, i) => {
      body += `<tr><td>${i+1}</td><td>${player.player}</td><td> ${parseFloat(player.balance).toFixed(3)}</td></tr>`;
    })

    el("content").innerHTML =
      `<table>
        ${header}
         ${body}
      </table>`;
    el('generate').disabled = false;
  }
}