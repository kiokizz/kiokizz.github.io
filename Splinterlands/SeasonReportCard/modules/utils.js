async function attempt_get_request(url, num_attempts) {
  let response = false;
  do {
    response = await get_request(url)
  } while (response === false && num_attempts-- >= 0);
  return response;
}

async function get_request(url) {
  const location = window.location.hostname;
  const settings = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  };
  try {
    const fetchResponse = await fetch(url, settings);
    const data = await fetchResponse.json();
    return data;
  } catch (e) {
    update_status(e);
    return false;
  }
}

//Error messages
function update_status(text) {
  document.getElementById('content').innerHTML = text;
  console.log(text);
}

function stop_on_error(error_message) {
  alert(error_message);
  update_status(error_message);
  throw error_message;
}

function el(id) {
  return document.getElementById(id);
}