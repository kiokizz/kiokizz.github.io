<!DOCtype html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Splinterlands Collection Tools</title>
  <link rel="shortcut icon" href="resources/rose.jpg"/>
    <link rel="stylesheet" type="text/css" href="walletTools/walletTools.css">
  <script
    src="https://cdn.jsdelivr.net/npm/@hiveio/hive-js/dist/hive.min.js">

  </script>
  <script src="walletTools/utils.js"></script>
  <script src="walletTools/ui_utils.js"></script>
  <script src="walletTools/load_tab.js"></script>
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
            id="sps_tab_btn" onclick="switch_to_tab(this.id)" disabled>SPS
    </button>
    <button class="w3-button w3-border w3-round tab_btn"
            id="dec_tab_btn" onclick="switch_to_tab(this.id)" disabled>DEC
    </button>
    <button class="w3-button w3-border w3-round tab_btn"
            id="cre_tab_btn" onclick="switch_to_tab(this.id)" disabled>CREDITS
    </button>
    <button class="w3-button w3-border w3-round tab_btn"
            id="vou_tab_btn" onclick="switch_to_tab(this.id)" disabled>VOUCHER
    </button>
  </div>

  <div id='sps_tab_div' class="w3-panel w3-hide tab_div">

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
               oninput="validate_input(
                 this.id,
                 is_valid_splinterlands_username,
                 el('init_err')
               )">
        <p id="init_err" class="w3-panel w3-red w3-padding w3-hide"></p>
        <button id="init_btn" class="w3-button w3-theme"
                onclick="init_page('init_btn')">
          Begin
        </button>
      </div>

    </div>

    <header class="w3-container w3-theme"><br/></header>
  </div>
</div>

<script defer>
  show('init_modal');

  el('init_username').onkeydown = async e => {
    if (e.key === 'Enter' && !el('init_btn').disabled) el('init_btn').click();
  };

  async function init_page(btn_id) {
    el(btn_id).disabled = true;
    let input = el("init_username"), err = el("init_err");
    let username = validate_input(input, is_valid_splinterlands_username, err);
    if (!username) {
      el(btn_id).disabled = false;
      return;
    }

    request_transactions(username, 'SPS').then(txs => load_tab('sps', txs));
    request_transactions(username, 'DEC').then(txs => load_tab('dec', txs));
    request_transactions(username, 'CREDITS').then(txs => load_tab('cre', txs));
    request_transactions(username, 'VOUCHER').then(txs => load_tab('vou', txs));
  }

</script>

</body>

</html>