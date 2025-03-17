let el = (id) => document.getElementById(id)
let load_table = async function () {
  if (!params.validator_data) return el(`validators_table`).innerHTML = `No data loaded.`

  params.validators = await calculate_weights(params.validator_data)

  console.log(params.validators)

  let table_head =
      `<tr class="w3-dark-grey" style="border-bottom: 2px double black">
                <th>#</th>
                <th>Validator</th>
                <th>API</th>
                <th>Post</th>
                <th>Version</th>
                <th>Active</th>
                <th>Misses</th>
                <th>Votes</th>
                <th>Weight</th>
                <th id="votes_header" class="w3-center">Vote</th>
      </tr>`

  let position = 1
  let table_body = ``
  for (let val of params.validators) {
    let row =
        `<tr id="row_${val.account_name}" ${position === 10 ? ` style="border-bottom: 1px dashed black"` : ``}> 
            <td>${val.is_active ? `${position <= 10 ? `<b>${position++}</b>` : position++}` : '-'}</td>
            <td><img src="https://images.hive.blog/u/${val.account_name}/avatar" alt="Hive Avatar"  width="28" height="28"> ${val.account_name}</td>
            <td id="val.${val.account_name}">${val.api_url ? `<a href="${filterAPIurl(val.api_url)}" target="_blank">API</a>` : '-'}</td>
            <td>${val.post_url ? `<a href="${val.post_url}" target="_blank">PeakD</a>` : '-'}</td>
            <td>${val.last_version}</td>
            <td>${val.is_active ? `🟢` : `⚪`}</td>
            <td>${val.missed_blocks}</td>
            <td>${num_formatter(val.total_votes)}</td>
            <td>${val.weight > 0 ? val.weight.toFixed(2) + `%` : `-`}</td>
            <td id="btn_${val.account_name}"><button id="inner_button_${val.account_name}" onclick="vote(\`${val.account_name}\`)" class="w3-button w3-dark-grey w3-hover-green w3-block w3-medium"><b>Vote</b></button></td>
        </tr>\n`
    table_body += row
  }

  let table =
      `<table class="w3-table w3-striped w3-bordered>
            <thead class="w3-grey">${table_head}</thead>
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

  // Count occurrences of each API URL
  params.validators.forEach(validator => {
    let apiUrl = validator.api_url?.trim(); // Ensure it's a string and remove spaces
    if (!apiUrl) return; // Skip null/undefined API URLs

    apiUrlMap.set(apiUrl, (apiUrlMap.get(apiUrl) || 0) + 1);
  });

  // Filter validators with unique API URLs
  let uniqueValidators = params.validators.filter((validator, index) => {
    let apiUrl = validator.api_url?.trim();
    params.validators[index].unique_api = (apiUrl && apiUrlMap.get(apiUrl) === 1)
    return apiUrl && apiUrlMap.get(apiUrl) === 1;
  });

  // Fetch validator statuses
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

      if (count === 0) average_block = last_block;
      else average_block = ((average_block * count) + last_block) / (count++);

      // Compare `last_block` with `average_block` and update UI
      let diff = Math.abs(last_block - average_block);
      if (diff > 300) validator_td.innerHTML = `🔴${unique_warning} ${validator_td.innerHTML}`
      else if (diff > 30) validator_td.innerHTML = `🟡${unique_warning} ${validator_td.innerHTML}`
      else validator_td.innerHTML = `🟢${unique_warning} ${validator_td.innerHTML}`

    } catch (error) {
      // console.error(`Error fetching status for ${validator.account_name}:`, error);
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

let show_user_votes = async function () {
  let user = getLoginCookie()
  let user_votes = await validator_api.votes_by_account(user)
  params.user_votes = user_votes

  let votes = []
  user_votes.forEach(val => {
    votes.push(val.validator)
  });

  for (let val of params.validators) {
    // Validator Row Highlight
    let row = el(`row_${val.account_name}`);
    if (votes.includes(val.account_name)) row.classList.add("w3-pale-green")
    else row.classList = ``

    // Vote Button
    let btn = el(`btn_${val.account_name}`)
    if (votes.includes(val.account_name)) btn.innerHTML =
        `<button id="inner_button_${val.account_name}" onclick="remove_vote(\`${val.account_name}\`)" class="w3-button w3-light-green w3-hover-red w3-block w3-medium"><b>Un-Vote</b></button>`
    else btn.innerHTML =
        `<button id="inner_button_${val.account_name}" onclick="vote(\`${val.account_name}\`)" class="w3-button w3-dark-grey w3-hover-green w3-block w3-medium"><b>Vote</b></button>`

    // Disable vote button if too votes full.
    let inner_btn = el(`inner_button_${val.account_name}`)
    if (user_votes.length === 10 && !votes.includes(val.account_name)) inner_btn.disabled = true
  }

  el(`votes_header`).innerText = `Votes (${user_votes.length}/10)`
}

async function vote(account) {
  el(`inner_button_${account}`).disabled = true

  let user = getLoginCookie()
  let id = `sm_approve_validator`
  let json = JSON.stringify({
    "account_name": account
  })
  const hive_keychain = window.hive_keychain;
  hive_keychain.requestCustomJson(user, id, 'Active', json, `Vote for @${account}'s as Validator`, async (response) => {
    console.log(response);
    await new Promise(resolve => setTimeout(resolve, 6000));
    await show_user_votes()
    await new Promise(resolve => setTimeout(resolve, 10000));
    await show_user_votes()
  })
}

async function remove_vote(account) {
  el(`inner_button_${account}`).disabled = true

  let user = getLoginCookie()
  let id = `sm_unapprove_validator`
  let json = JSON.stringify({
    "account_name": account
  })
  const hive_keychain = window.hive_keychain;
  hive_keychain.requestCustomJson(user, id, 'Active', json, `Remove vote for @${account}'s as Validator`, async (response) => {
    console.log(response);
    await new Promise(resolve => setTimeout(resolve, 6000));
    await show_user_votes()
    await new Promise(resolve => setTimeout(resolve, 10000));
    await show_user_votes()
  })
}

let load_intro_stats = function () {
  let top_10_weight = 0
  let next_10_weight = 0
  let other_active_notes_with_votes = 0
  let user_votes = params.user_votes

  let position = 1

  console.log(`load intro stats`, params.validators)

  params.validators.forEach(val => {
    if (val.is_active) {
      if (position <= 10) top_10_weight += val.weight
      else if (position <= 20) next_10_weight += val.weight
      else if (parseFloat(val.total_votes) > 0) other_active_notes_with_votes++
      position++
    }
  })

  let used_votes = getLoginCookie() ? `- You are currently voting for ${params.user_votes.length} of your 10 votes.<br>` : ``

  el(`intro_stats`).innerHTML =
      `${used_votes}
        - The top 10 validators are currently verifying ${top_10_weight.toFixed(2)}% of blocks.<br>
        - The next 10 validators are currently verifying ${next_10_weight.toFixed(2)}% of blocks.<br>
        - The remaining ${(100-top_10_weight-next_10_weight).toFixed(2)}% of blocks are verified by the remaining ${other_active_notes_with_votes} nodes with votes.`
}