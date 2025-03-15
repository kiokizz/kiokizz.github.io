console.log(`validator.js`)
let validator_api = {
  default_api: `https://validator.splinterstats.net`,
  selected_api: `https://validator.splinterstats.net`
}

let params = {
  monthly_sps_rewards: 375000,
  validator_data: false,
}

validator_api.status = async function (url) {
  console.log(`status ${url}`)
  url = `${url}/status`
  try {
    let validator_status = (await axios.get(url)).data;
    console.log('status:', validator_status);
    return validator_status
  } catch (error) {
    console.error('Error checking validator status:', error.message);
  }
}

validator_api.get_validators = async function (limit = 1000, skip = 0) {
  console.log(`get_validators ${limit} ${skip}`)
  let url = `${validator_api.selected_api}/validators?limit=${limit}&skip=${skip}`
  try {
    params.validator_data = (await axios.get(url)).data;
    console.log('get_validators:', params.validator_data);
    return params.validator_data
  } catch (error) {
    console.error('Error getting list of validators:', error.message);
  }
}