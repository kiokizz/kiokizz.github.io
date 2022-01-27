function is_valid_splinterlands_username(username) {
  let regex = new RegExp(/^[a-z](-[a-z0-9](-[a-z0-9])*)?(-[a-z0-9]|[a-z0-9])*(?:\.[a-z](-[a-z0-9](-[a-z0-9])*)?(-[a-z0-9]|[a-z0-9])*)*$/);
  return regex.test(username);
}

async function get_token_history(username, token_symbol) {
  let array = [];
  let response = [];
  do {
    response = await request_transactions(username, token_symbol, array.length);
    array = array.concat(response);
  } while (response.length === 500);
  return array.filter((tx, index) => data.indexOf(tx) === index);
}

function request_transactions(nam, tok, off = 0, lim = 500, txs = []) {
  tok = tok.toUpperCase();
  return new Promise((resolve, reject) => {
    let url = `https://api2.splinterlands.com/players/balance_history`
      + `?token_type=${tok}&offset=${off}&limit=${lim}&username=${nam}`;
    fetch(url)
      .then(response => response.json())
      .then(async response => {
        txs = txs.concat(response);
        if (response.length === 500)
          resolve(await request_transactions(nam, tok, off + lim, lim, txs));
        txs = txs.filter((tx, index, txs) => {
          let fist_occurence = txs.findIndex(tx2 => {
            return tx["trx_id"] === tx2["trx_id"]
              && tx['balance_end'] === tx2['balance_end'];
          });
          return fist_occurence === index;
        });
        resolve(txs);
      })
      .catch(function (err) {
        // 500/5min limit??
        // Retry on error? resolve(response = await request_transactions(username, token, array.length);
        console.error(err);
        console.error(arguments);
        reject(err);
      });
  });
}