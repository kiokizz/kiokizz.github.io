function is_valid_splinterlands_username(username) {
  let regex = new RegExp(/^[a-z](-[a-z0-9](-[a-z0-9])*)?(-[a-z0-9]|[a-z0-9])*(?:\.[a-z](-[a-z0-9](-[a-z0-9])*)?(-[a-z0-9]|[a-z0-9])*)*$/);
  return regex.test(username);
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
          let obj;
          if (response.length === 500)
            obj = await request_transactions(nam, tok, off + lim, lim, txs);
          else obj = {};

          txs.forEach(tx => {
            let hash = `${tx['created_date']}${tx['trx_id']}${tx['balance_end']}`;
            tx['hash'] = hash;
            obj[hash] = tx;
          });

          if (off > 0) resolve(obj);
          else {
            let return_arr = Object.values(obj);
            return_arr.sort((tx1, tx2) =>
              tx1['hash'].localeCompare(tx2['hash'])
            );
            resolve(return_arr);
          }
        })
        .catch(err => {
          reject(err);
        });
    }
  );
}

// This converts an array of objects into a csv file for download
function download_csv(arr, title) {
  let csv_data =
    "data:text/plain;charset=utf-8,"
    + `${Object.keys(arr[0]).join(',')}\n`
    + arr.map(c => Object.values(c).join(',')).join("\n");

  let csv_link = document.createElement('a');
  csv_link.setAttribute('href', encodeURI(csv_data));
  csv_link.setAttribute('download', `${title}.csv`);
  csv_link.style.display = 'none';
  document.body.appendChild(csv_link);
  csv_link.click();
  // document.body.removeChild(csv_link);
}