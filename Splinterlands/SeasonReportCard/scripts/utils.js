//https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not
function isJSON(str) {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' ||
      type === '[object Array]';
  } catch (err) {
    return false;
  }
}

//Ajax URL Call
function request(url, x, proceedingFunction) {
  $.ajax({
    url: url,
    type: 'GET',
    success: function (data) {
      proceedingFunction(data);
    },
    error: function (data) {
      if (x < 5) {
        setTimeout(() => {
          x++;
          request(url, x, proceedingFunction)
          console.log(`Error - Retrying to access API: ${url}|x:${x}`);
        }, 1000);
      } else console.log(`Error - Unable to access API ${url}|x:${x}`);
      console.log(`Error: ${data}`);
    }
  });
}