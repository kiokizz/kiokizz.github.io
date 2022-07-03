let pages = {
  "seasonReportCard.html": "Season Report Card",
  "rewardCards.html": "Rewards Cards",
  "cardsByLeagueCap.html": "Cards by League Cap",
  "richList.html": "Rich List",
  "bites.html": "Splinter Bites"
};

let rewards_cards_experimental_colour = `<div class="toggle-container">
    <button class="theme-btn light" onclick="setTheme('light')" title="Style Change">
        Light Mode
    </button>
    <button class="theme-btn dark" onclick="setTheme('dark')" title="Style Change">
        Dark Mode
    </button>
</div>`;

document.getElementById("nav_div").innerHTML =
  Object.keys(pages).reduce((html, href) => {
    let classes = "buttons w3-bar-item w3-button w3-text-white w3-border-right"
      + (location.pathname.split("/").pop() === href ? " w3-theme-d3" : "");
    return html + `<a id="${href}" href="${href}" class="${classes}">${pages[href]}</a>`;
  }, '<div class="w3-bar w3-border-top">') + `${(location.pathname.split("/").pop() === "rewardCards.html" ? rewards_cards_experimental_colour : "")}</div>`;