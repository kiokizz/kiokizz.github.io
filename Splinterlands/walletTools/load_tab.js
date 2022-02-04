const layout_info = {};

['sps', 'dec', 'cre', 'vou'].forEach(t => {
  layout_info[t] = {
    div: `${t}_tab_div`,
    tab_btn: `${t}_tab_btn`,
    tbl_div: `${t}_tbl`,
    back_btn: `${t}_back`,
    next_btn: `${t}_next`,
    dld_csv_btn: `${t}_csv`
  };
});


function load_tab(tok, txs) {
  console.log(txs);

  let info = layout_info[tok];
  let tab = el(info.div);
  el(info.tab_btn).disabled = false;
  if (is_visible('init_modal')) {
    el(info.tab_btn).click();
    show('init_modal', false);
  }

  append_hr(tab);
  tab.innerHTML += get_balance_section();
  append_hr(tab);
  tab.innerHTML += get_graphs_section();
  append_hr(tab);
  tab.innerHTML += get_tx_list(txs);
  tab.append(...get_pagination_buttons());
  tab.innerHTML += get_download_buttons();

  const lim = 100;
  let off = (lim => {
    let off = 0;
    return {
      decrement: () => off - lim <= 0 ? off : (off -= lim),
      increment: () => off + lim >= txs.length ? off : (off += lim)
    };
  })(lim);

  el(info['back_btn']).onclick = () => refresh_tx_table(txs, off.decrement());
  el(info['next_btn']).onclick = () => refresh_tx_table(txs, off.increment());

  function append_hr(e) {
    e.appendChild(document.createElement('hr'));
  }

  function get_balance_section() {
    return `<p class="w3-center"><b>Balances</b></p>
    <div class="w3-row w3-row-padding">
      <div class="w3-col w3-center" style="width: 20%">Balance: 20,000</div>
      <div class="w3-col w3-center" style="width: 20%">Balance: 20,000</div>
      <div class="w3-col w3-center" style="width: 20%">Balance: 20,000</div>
      <div class="w3-col w3-center" style="width: 20%">Balance: 20,000</div>
      <div class="w3-col w3-center" style="width: 20%">Balance: 20,000</div>
    </div>`;
  }

  function get_graphs_section() {
    return `<div class="w3-row w3-row-padding">
      <div class="w3-col w3-center w3-red" style="width: 65%">Balance: 20,000
      </div>
      <div class="w3-col w3-center w3-blue" style="width: 35%">Balance: 20,000
      </div>
    </div>`;
  }

  function get_tx_list(txs) {
    return `<p class="w3-center"><b>Transaction List</b></p>`
      + get_table_filters()
      + get_tx_table(txs);
  }

  function get_table_filters() {
    return `<div class="w3-row w3-row-padding">
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
              ${get_input('chk_in', 'In')}
              ${get_input('chk_out', 'Out')}
              <hr style="margin: 1em 0 .5em 0"/>
              Transaction Party
              ${get_input('chk_system', 'System')}
              ${get_input('chk_player', 'Player')}
            </div>
          </div>
        </div>

      </div>
    </div>`;

    function get_input(id, name) {
      return `
        <label><div>
          <input class="w3-check" type="checkbox" id="${id}" checked> ${name}
        </div></label>`;
    }
  }

  function refresh_tx_table(txs, off) {
    let table_div = el(info['tbl_div']);
    table_div.innerHTML = get_tx_table(txs, off);
  }

  function get_tx_table(txs, off = 0, lim = lim) {
    let format_tx_amt = amt => (amt >= 0) ? amt : `(${amt.substr(1)})`;
    let get_tx_rows = txs => txs.reduce((trs, tx, idx) => {
      if (idx < off || idx >= off + lim) return trs;
      return trs + `<tr>
        <td class="w3-left-align">${tx['created_date'].substr(0, 10)}</td>
        <td class="w3-center">${tx['type']}</td>
        <td class="w3-right-align">${format_tx_amt(tx['amount'])}</td>
        <td class="w3-right-align">${tx['balance_end']}</td>
      </tr>`;
    }, '');

    return `<div id="${info['tbl_div']}" class="w3-responsive">
      <table class="w3-table-all w3-hoverable w3-margin-top w3-small"
        style="overflow-x: scroll">
        <tr class="w3-theme-l1">
          <th class="w3-left-align">Date</th>
          <th class="w3-center">Description</th>
          <th class="w3-right-align">Amount</th>
          <th class="w3-right-align">Balance</th>
        </tr>
        ${get_tx_rows(txs)}
      </table>
      </div>`;
  }

  function get_pagination_buttons() {
    let back = document.createElement('button');
    back.className += 'w3-button w3-border w3-round';
    back.innerText = 'Back';
    back.id = info['back_btn'];
    let next = document.createElement('button');
    next.className += 'w3-button w3-border w3-round w3-left-align';
    next.innerText = 'Next';
    next.id = info['next_btn'];

    return [back, next];
  }

  function get_download_buttons() {
    return `<div class="w3-panel w3-center">
      <button class="w3-button w3-border w3-round tab_btn"
              id="export_sps_csv_btn" onclick="alert(this.id)">
        Export as CSV
      </button>
      <button class="w3-button w3-border w3-round tab_btn"
              id="export_sps_pdf_btn" onclick="alert(this.id)">
        Export as PDF
      </button>
    </div>`;
  }
}