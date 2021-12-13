let pages = {
  "seasonReportCard.html": "Season Report Card",
  "rewardCards.html": "Rewards Cards",
  "cardsByLeagueCap.html": "Cards by League Cap",
  "richList.html": "Rich List"
};

document.getElementById("nav_div").innerHTML =
  Object.keys(pages).reduce((html, href) => {
    let classes = "w3-bar-item w3-button w3-text-white w3-border-right"
      + (location.pathname.split("/").pop() === href ? " w3-theme-d3" : "");
    return html + `<a href="${href}" class="${classes}">${pages[href]}</a>`;
  }, '<div class="w3-bar w3-border-top">') + '</div>';