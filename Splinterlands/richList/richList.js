function data_collector() {
  let context = this;
  let query;
  let rowData = {};
  let supply = 0;
  let numbAccounts = 0;

  let formatter = new Intl.NumberFormat('en-US').format;

  let types_names = {
    DEC: "DEC",
    GRAIN: "Grain",
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
    TOTEMFL: "Legendary Totem Fragment",
    TOTEMFE: "Epic Totem Fragment",
    TOTEMFR: "Rare Totem Fragment",
    TOTEMFC: "Common Totem Fragment",
    TOTEML: "Legendary Totem Claim",
    TOTEME: "Epic Totem Claim",
    TOTEMR: "Rare Totem Claim",
    TOTEMC: "Common Totem Claim",
    MERITS: "Merits",
    GLADIUS: "GLADIUS",
    BLDSTONE: "Blood Stone",
    PWRSTONE: "Power Stone",
    CHAOS: "CHAOS",
    VOUCHER: "Vouchers",
    LICENSE: "Validator Licenses",
    RIFT: "RIFT",
    NIGHTMARE: "NIGHTMARE (TD)"
  }

  this.generate = function () {
    el("content").innerHTML = 'Loading...';
    el('generate').disabled = true;

    query = el('type').value;

    request(`https://api2.splinterlands.com/players/richlist?token_type=${query}`, 0, context.sortData);
  }

  this.sortData = function (data) {
    console.log(`Sort Data....`);
    rowData = data.richlist;
    supply = data.total_quantity;
    numbAccounts = data.total_accounts;
    context.makeTable();
    let CSVs = document.getElementsByClassName("CSV");
    Array.from(CSVs).map(c => c.style.display = "block");
  }

  this.makeTable = function () {
    let header = `<th>#</th><th>Player</th><th>${types_names[el('type').value]} Balance</th><th>% Total</th>`;
    let body = ``;

    let top = {10: 0, 50: 0, 100: 0, 200: 0};
    let topKeys = Object.keys(top);
    let null_val = 0;

    rowData.forEach((player, i) => {
      topKeys.forEach((category, index) => {
        if (player.player === "null") null_val = 1
        else if (i - null_val <= category) top[category] += player.balance;
      })
      let position = i + 1 - null_val
      let style = ``
      if (player.player === "null") {
        position = "-"
        style = ` style="color:#bcbcbc"`
      }
      body += `<tr${style}><td>${position}</td><td>${player.player}</td><td> ${formatter(parseFloat(player.balance).toFixed(3))}</td><td>${(player.balance / supply * 100).toFixed(2)}%</td></tr>`;
    })

    el("content").innerHTML =
        `Total ${types_names[el('type').value]} in circulation: ${formatter(supply)} in ${formatter(numbAccounts)} accounts.<br><br>
Percentage Owned by <i>(exlcuding @null)</i>:
<ul>
  <li>Top 10: ${formatter(top[10].toFixed(3))} ${types_names[el('type').value]} (${(top[10] / supply * 100).toFixed(2)}%)</li>
  <li>Top 50: ${formatter(top[50].toFixed(3))} ${types_names[el('type').value]} (${(top[50] / supply * 100).toFixed(2)}%) </li>
  <li>Top 100: ${formatter(top[100].toFixed(3))} ${types_names[el('type').value]} (${(top[100] / supply * 100).toFixed(2)}%)</li>
  <li>Top 200: ${formatter(top[200].toFixed(3))} ${types_names[el('type').value]} (${(top[200] / supply * 100).toFixed(2)}%)</li>
</ul>
      <table>
        ${header}
         ${body}
      </table>`;
    el('generate').disabled = false;

    el('disclaimer').innerHTML = `Disclaimer: Human error could result in mistakes in the representation of the
  above data. Extracted from
  https://game-api.splinterlands.com/players/richlist?token_type=${el('type').value}.
  <br>
  <br>
  <a href="https://github.com/kiokizz">GitHub</a>
  | Check out my blogs <a href="https://hive.blog/@kiokizz">@kiokizz</a>
  & <a href="https://hive.blog/@splinterstats">@splinterstats</a>`
  }

  this.download = function () {
    let dataCSV = `#,Player,${types_names[el('type').value]} Balance,% Total\n`;
    rowData.forEach((player, i) => {
      dataCSV += `${i + 1},${player.player},${parseFloat(player.balance).toFixed(3)},${(player.balance / supply * 100).toFixed(2)}%\n`;
    })

    let csv_text = document.createElement('a');
    csv_text.setAttribute('href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(dataCSV));

    let d = new Date();
    let date_string = d.getFullYear().toString() +
        d.getDate().toString() +
        d.getHours().toString() +
        d.getSeconds().toString();
    let descriptor = `${query}-${date_string}`;
    csv_text.setAttribute('download', `${descriptor}.csv`);

    csv_text.style.display = 'none';
    document.body.appendChild(csv_text);
    csv_text.click();
    document.body.removeChild(csv_text);
  }
}