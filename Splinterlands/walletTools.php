<!DOCtype html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Splinterlands Collection Tools</title>
  <link rel="shortcut icon" href="resources/rose.jpg"/>
  <!--  <link rel="stylesheet" type="text/css" href="walletTools/walletTools.css">-->
  <script
    src="https://cdn.jsdelivr.net/npm/@hiveio/hive-js/dist/hive.min.js"></script>
  <script src="walletTools/utils.js"></script>
  <script src="walletTools/ui_utils.js"></script>
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <link rel="stylesheet"
        href="https://www.w3schools.com/lib/w3-theme-blue-grey.css">
</head>

<body>
<div class="page_header w3-panel w3-theme" style="margin-top: 0;">
  <h1><a href='index.html'>SplinterStats</a> - Wallet Tools</h1>
  <sub>Alpha: A system to sort and manage your Splinterlands card
    collection.</sub>
  <p></p>
</div>

<div style="max-width: 100ch">

  <div class="w3-panel w3-center">
    <button class="w3-button w3-border w3-round tab_btn"
            id="sps_tab_btn" onclick="switch_to_tab(this.id)">SPS
    </button>
    <button class="w3-button w3-border w3-round tab_btn"
            id="dec_tab_btn" onclick="switch_to_tab(this.id)">DEC
    </button>
    <button class="w3-button w3-border w3-round tab_btn"
            id="cre_tab_btn" onclick="switch_to_tab(this.id)">CREDITS
    </button>
    <button class="w3-button w3-border w3-round tab_btn"
            id="vou_tab_btn" onclick="switch_to_tab(this.id)">VOUCHER
    </button>
  </div>

  <div id='sps_tab_div' class="w3-panel w3-hide tab_div">
    <hr/>
    <p class="w3-center"><b>Balances</b></p>
    <div class="w3-row w3-row-padding">
      <div class="w3-col w3-center" style="width: 20%">Balance: 20,000</div>
      <div class="w3-col w3-center" style="width: 20%">Balance: 20,000</div>
      <div class="w3-col w3-center" style="width: 20%">Balance: 20,000</div>
      <div class="w3-col w3-center" style="width: 20%">Balance: 20,000</div>
      <div class="w3-col w3-center" style="width: 20%">Balance: 20,000</div>
    </div>
    <hr/>
    <div class="w3-row w3-row-padding">
      <div class="w3-col w3-center w3-red" style="width: 65%">Balance: 20,000
      </div>
      <div class="w3-col w3-center w3-blue" style="width: 35%">Balance: 20,000
      </div>
    </div>
    <hr/>
    <p class="w3-center"><b>Transaction List</b></p>
    <div class="w3-row w3-row-padding">
      <div class="w3-col w3-center w3-padding" style="width: 65%">
        <input class="w3-input w3-border w3-round"
               placeholder="Search: (Memo, name, etc.)">
      </div>
      <div class="w3-col" style="width: 35%">
        <div class="w3-dropdown-hover w3-round">
          <button class="w3-button w3-round">Filters</button>
          <div class="w3-dropdown-content w3-bar-block w3-border w3-left-align"
               style="padding: 4px 8px">
            <div style="width: 100%">
              Token Direction
              <label>
                <div><input class="w3-check" type="checkbox" id="chk_in"
                            checked> In
                </div>
              </label>
              <label>
                <div><input class="w3-check" type="checkbox" id="chk_out"
                            checked> Out
                </div>
                <hr style="margin: 1em 0 .5em 0"/>
                Transaction Party
              </label>
              <label>
                <div><input class="w3-check" type="checkbox" id="chk_system"
                            checked> System
                </div>
              </label>
              <label>
                <div><input class="w3-check" type="checkbox" id="chk_player"
                            checked> Player
                </div>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
    <table class="w3-table-all w3-hoverable w3-margin-top w3-small">
      <tr class="w3-theme-l1">
        <th class="w3-right-align">Date</th>
        <th class="w3-center">Description</th>
        <th class="w3-right-align">Debit</th>
        <th class="w3-right-align">Credit</th>
        <th class="w3-right-align">Balance</th>
      </tr>
      <tr>
        <td class="w3-right-align">Jill</td>
        <td class="w3-center">Smith</td>
        <td class="w3-right-align">50</td>
        <td class="w3-right-align">Smith</td>
        <td class="w3-right-align">50</td>
      </tr>
    </table>

    <div class="w3-panel w3-center">
      <button class="w3-button w3-border w3-round tab_btn"
              id="export_sps_csv_btn" onclick="alert(this.id)">
        Export as CSV
      </button>
      <button class="w3-button w3-border w3-round tab_btn"
              id="export_sps_pdf_btn" onclick="alert(this.id)">
        Export as PDF
      </button>
    </div>
  </div>

  <div id='dec_tab_div' class="w3-panel w3-hide tab_div">

  </div>

  <div id='cre_tab_div' class="w3-panel w3-hide tab_div">

  </div>

  <div id='vou_tab_div' class="w3-panel w3-hide tab_div">

  </div>

</div>

<hr/>

<p>Disclaimer: Human error could result in mistakes in the representation of the
  above data. Extracted from
  https://game-api.splinterlands.com/cards/get_details.
  <br>
  <br>
  <a href="https://github.com/kiokizz">GitHub</a>
  | Check out my blogs <a href="https://hive.blog/@kiokizz">@kiokizz</a>
  & <a href="https://hive.blog/@splinterstats">@splinterstats</a>
</p>

<hr/>

<br><br><br><br>


<div id="init_modal" class="w3-modal w3-hide w3-show">
  <div class="w3-modal-content">
    <header class="w3-container w3-theme">
      <h4>Please enter a player username</h4>
    </header>

    <div class="w3-container">
      <div class="w3-panel">
        <label>Username (without @): </label>
        <input class="w3-input w3-border" type="text" id="init_username"
               value="" placeholder="username"
               oninput="validate_input(this.id, is_valid_splinterlands_username, el('init_err'))">
        <p id="init_err" class="w3-panel w3-red w3-padding w3-hide"></p>
        <button id="init_btn" class="w3-button w3-theme"
                onclick="init_page(this.id)">
          Begin
        </button>
      </div>

    </div>

    <header class="w3-container w3-theme"><br/></header>
  </div>
</div>

<script defer>
  show('init_modal');

  async function init_page(btn_id) {
    el(btn_id).disabled = true;
    let input = el("init_username"), err = el("init_err");
    let username = validate_input(input, is_valid_splinterlands_username, err);
    if (!username) {
      el(btn_id).disabled = false;
      return;
    }


    request_transactions(username, 'SPS').then(console.log)
    request_transactions(username, 'DEC').then(console.log)
    request_transactions(username, 'CREDITS').then(console.log)
    request_transactions(username, 'VOUCHER').then(console.log)
  }

</script>

</body>

</html>