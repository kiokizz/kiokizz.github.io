let el = element => {
  if (typeof element === 'string') return document.getElementById(element);
  else return element;
};

function switch_to_tab(id) {
  let tab_btns = document.getElementsByClassName('tab_btn');
  Array.from(tab_btns).forEach((btn, i) => {
    tab_btns[i].className = btn.className.replaceAll(' w3-theme', '');
  });

  let tab_divs = document.getElementsByClassName('tab_div');
  Array.from(tab_divs).forEach((div, i) => {
    tab_divs[i].className = div.className.replaceAll(' w3-show', '');
  });

  el(id).className += ' w3-theme';
  el(`${id.substr(0, 7)}_div`).className += ' w3-show';
}

function is_visible(element) {
  if (typeof element === 'string') element = el(element);
  return element.className.includes(' w3-show');
}

function show(element, show = true) {
  if (typeof element === 'string') element = el(element);
  if (show) element.className += ' w3-show';
  else element.className = element.className.replaceAll(' w3-show', '');
}

function validate_input(input, tester_function, err) {
  input = el(input);
  err = el(err);
  if (tester_function(input.value)) {
    show(err, false);
    return input.value;
  }
  err.innerText = 'Please input a valid Splinterlands username';
  show(err.id);
  return false;
}