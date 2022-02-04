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
            obj [hash] = tx;
          });
          // txs = txs.filter((tx, index, txs) => {
          //   console.log(index);
          //   let fist_occurence = -1;
          //   for (let [i, tx2] of txs.entries()) {
          //     if (i > index) break;
          //     if (tx["trx_id"] === tx2["trx_id"] && tx['balance_end'] === tx2['balance_end'])
          //       fist_occurence = i;
          //   }
          //   return fist_occurence === index;
          // });

          if (off > 0) resolve(obj);
          else {
            let return_arr = Object.values(obj);
            return_arr.sort((tx1, tx2) =>
              tx1['hash'].localeCompare(tx2['hash'])
            );
            resolve(return_arr);
          }
        })
        .catch(function (err) {
          // 500/5min limit??
          // Retry on error? resolve(response = await request_transactions(username, token, array.length);
          console.error(err);
          console.error(arguments);
          reject(err);
        });
    }
  )
    ;
}