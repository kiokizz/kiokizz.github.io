let el = (id) => document.getElementById(id)
let load_table = async function () {
  if (!params.validator_data) return el(`validators_table`).innerHTML = `No data loaded.`

  params.validators = await calculate_weights(params.validator_data)

  console.log(params.validators)

  let table_head =
      `<tr">
                <th>#</th>
                <th>Validator</th>
                <th>API</th>
                <th>Post</th>
                <th>Version</th>
                <th>Active</th>
                <th>Misses</th>
                <th>Votes</th>
                <th>Weight</th>
      </tr>`

  let position = 1
  let table_body = ``
  for (let val of params.validators) {
    let row =
        `<tr>
            <td>${val.is_active ? `${position <= 10 ? `<b>${position++}</b>` : position++}` : '-'}</td>
            <td><img src="https://images.hive.blog/u/${val.account_name}/avatar" alt="Hive Avatar"  width="28" height="28"> ${val.account_name}</td>
            <td id="val.${val.account_name}">${val.api_url ? `<a href="${filterAPIurl(val.api_url)}" target="_blank">API</a>` : '-'}</td>
            <td>${val.post_url ? `<a href="${val.post_url}" target="_blank">PeakD</a>` : '-'}</td>
            <td>${val.last_version}</td>
            <td>${val.is_active ? `🟢` : `⚪`}</td>
            <td>${val.missed_blocks}</td>
            <td>${num_formatter(val.total_votes)}</td>
            <td>${val.weight > 0 ? val.weight.toFixed(2) + `%` : `-`}</td>
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
  let total_votes = data.validators.reduce((votes, val) => votes + (val.is_active ? parseFloat(val.total_votes) : 0 || 0), 0);
  console.log(total_votes)
  let validators = []

  for (let val of data.validators) {
    if (val.is_active) val.weight = val.total_votes / total_votes * 100
    else val.weight = 0
    validators.push(val)
  }

  return validators
}

let num_formatter = function (num) {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + "m"
  else if (num >= 10000) return (num / 1000).toFixed(2) + "k"
  else return Math.round(num).toLocaleString();
}

let get_api_statuses = async function () {
  let average_block = null;
  let count = 0;

  if (!params.validators) return el(`validators_table`).innerHTML = `No data loaded.`

  let apiUrlMap = new Map();

  // Step 1: Count occurrences of each API URL
  params.validators.forEach(validator => {
    let apiUrl = validator.api_url?.trim(); // Ensure it's a string and remove spaces
    if (!apiUrl) return; // Skip null/undefined API URLs

    apiUrlMap.set(apiUrl, (apiUrlMap.get(apiUrl) || 0) + 1);
  });

  // Step 2: Filter validators with unique API URLs
  let uniqueValidators = params.validators.filter((validator, index) => {
    let apiUrl = validator.api_url?.trim();
    params.validators[index].unique_api = (apiUrl && apiUrlMap.get(apiUrl) === 1)
    return apiUrl && apiUrlMap.get(apiUrl) === 1;
  });

  // Step 2: Fetch validator statuses
  async function fetchValidatorStatuses() {
    for (let validator of params.validators) {
      if (!validator.api_url) continue
      check_validator_status(validator)
    }
  }

  async function check_validator_status(validator) {
    let validator_td = el(`val.${validator.account_name}`)
    let unique_warning = validator.unique_api ? `` : `⚠️`
    try {
      let validator_status = await validator_api.status(filterAPIurl(validator.api_url));

      // Update average_block calculation
      let last_block = validator_status.last_block;
      if (!validator_status.last_block) validator_status.last_block = 1

      if (count === 0) {
        average_block = last_block;
      } else {
        average_block = ((average_block * count) + last_block) / (count++);
      }

      // Compare `last_block` with `average_block` and update UI
      let diff = Math.abs(last_block - average_block);
      if (diff > 300) {
        validator_td.innerHTML = `🔴${unique_warning} ${validator_td.innerHTML}`
      } else if (diff > 30) {
        validator_td.innerHTML = `🟡${unique_warning} ${validator_td.innerHTML}`
      } else {
        validator_td.innerHTML = `🟢${unique_warning} ${validator_td.innerHTML}`
      }

    } catch (error) {
      console.error(`Error fetching status for ${validator.account_name}:`, error);
      validator_td.innerHTML = `⁉️${unique_warning} ${validator_td.innerHTML}`
    }
  }

  fetchValidatorStatuses();
}

function filterAPIurl(url) {
  // upgrade to HTTPS
  url = url.startsWith(`http://`) ? `https://` + url.substring(7) : url;
  // remove trailer '/'
  url = url.endsWith('/') ? url.slice(0, -1) : url
  // Remove /status is
  url = url.endsWith(`status`) ? url.slice(0, -7) : url;
  return url
}