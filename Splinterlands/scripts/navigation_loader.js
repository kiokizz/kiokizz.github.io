let pages = {
  "seasonReportCard.html": "Season Report Card",
  "battles.html": "Battle Data",
  "rewardCards.html": "Rewards Cards",
  "cardsByLeagueCap.html": "Cards by League Cap",
  "richList.html": "Rich List",
  "bites.html": "Splinter Bites",
  "validators.html": "Validators"
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
          + (location.pathname.split("/").pop() === href ? `${localStorage.theme !== 'dark' ? " w3-theme-d3" : " darken"}` : "");
      return html + `<a id="${href}" href="${href}" class="${classes}">${pages[href]}</a>`;
    }, '<div class="w3-bar w3-border-top">') + `${(location.pathname.split("/").pop() === "rewardCards.html" ? rewards_cards_experimental_colour : "")}</div>`;

import("https://www.googletagmanager.com/gtag/js?id=G-DB2Z620NEG").then((mod2) => {
  console.log(`Google Analytics`);
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  gtag('js', new Date());

  let domain = window.location.hostname
  if (domain === "splinterstats.net") {
    gtag('config', 'G-DB2Z620NEG');
    console.log(`SplinterStats accessed via ${domain} (G-DB2Z620NEG)`)
  }
  else {
    gtag('config', 'G-0QWWFX50FM');
    console.log(`SplinterStats accessed via ${domain} (github) (G-0QWWFX50FM)`)
  }
});

