let el = (id) => document.getElementById(id)

let load_table = async function () {
  if (!params.validator_data) return el(`validators_table`).innerHTML = `No data loaded.`

  let validators = await calculate_weights(params.validator_data)

  console.log(validators)

  let table_head =
      `<tr">
                <th>Validator</th>
                <th>API</th>
                <th>Post</th>
                <th>Last Version</th>
                <th>Active</th>
                <th>Missed Blocks</th>
                <th>Total Votes</th>
                <th>Voted Weight</th>
      </tr>`

  let table_body = ``
  for (let val of validators) {
    let row =
        `<tr>
            <td>${val.account_name}</td>
            <td>
                ${val.api_url ? `<a href="${val.api_url}" target="_blank">API</a>` : '-'}
            </td>
            <td>
                ${val.post_url ? `<a href="${val.post_url}" target="_blank">PeakD</a>` : '-'}
            </td>
            <td>${val.last_version}</td>
            <td>${val.is_active}</td>
            <td>${val.missed_blocks}</td>
            <td>${val.total_votes}</td>
            <td>${val.weight.toFixed(2)}%</td>
        </tr>\n`
    table_body += row
  }

  let table =
      `<table class="w3-table w3-striped w3-bordered>
            ${table_head}
            ${table_body}   
       </table>`

  el(`validators_table`).innerHTML = table
}

let calculate_weights = async function (data) {
  let total_votes = data.validators.reduce((votes, val) => votes + (parseFloat(val.total_votes) || 0), 0);
  console.log(total_votes)
  let validators = []

  for (let val of data.validators) {
    val.weight = val.total_votes / total_votes * 100
    validators.push(val)
  }

  return validators
}