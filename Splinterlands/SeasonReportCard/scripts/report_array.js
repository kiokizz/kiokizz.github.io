//Data d

let report_array = {
  report: null,
  logInType: `keychainBegin`,
  text_fields: ["title", "textOpening", "performance", "top10summoners", "top100monsters", "winratebyruleset", "textRewards", "textClosing"],
  season: {
    nameNum: 0,
    date_start: undefined,
    date_end: undefined,
    season_end_times: {}
  },
  player: ``,
  matches: {
    rating: 0,
    ratingMovement: 0,
    league: `n/a`,
    rank: 0,
    rankMovement: 0,
    Ranked: {
      wins: 0,
      loss: 0,
      draws: 0,
    },
    Tournament: {
      ids: [],
      data: [],
      prizes: {},
      prize_list: [],
      prize_tally: {
        DEC: {
          name: `DEC`,
          count: 0,
          quantity: 0
        },
        HIVE: {
          name: `Hive`,
          count: 0,
          quantity: 0
        },
        HBD: {
          name: `Hive Backed Dollars`,
          count: 0,
          quantity: 0
        },
        SIM: {
          name: `Sim City SIM`,
          count: 0,
          quantity: 0
        },
        ENTRY: {
          name: `Sim City ENTRY`,
          count: 0,
          quantity: 0
        },
        CUSTOM: {
          name: `Custom Prizes`,
          count: 0,
          quantity: `n/a`
        }
      },
      wins: 0,
      loss: 0,
      draws: 0,
      win_rates: {
        0: 0
      }
    },
    total_matches: 0,
    teams_fielded: 0,
    longestStreak: 0,
    higestRatedOpp: {
      rating: 0,
      name: `n/a`
    },
    opponents: [],
    teams: [],
    cards: {
      array: [],
      monsters: {},
      summoners: {}
    },
    rulesets: {},
    ruleset_frequency_table: ``
  },
  tournaments: {
    count: 0,
    prizes: []
  },
  earnings: {
    template: ``,
    matches: 0,
    loot_chests: {
      daily: {
        count: 0,
        dec: 0,
        legendary_potion: 0,
        alchemy_potion: 0,
        cards: {
          stand: {
            1: {
              count: 0,
              dec: 0
            },
            2: {
              count: 0,
              dec: 0
            },
            3: {
              count: 0,
              dec: 0
            },
            4: {
              count: 0,
              dec: 0
            },
            total: {
              count: 0,
              dec: 0
            }
          },
          gold: {
            1: {
              count: 0,
              dec: 0
            },
            2: {
              count: 0,
              dec: 0
            },
            3: {
              count: 0,
              dec: 0
            },
            4: {
              count: 0,
              dec: 0
            },
            total: {
              count: 0,
              dec: 0
            }
          }
        },
        untamed_packs: 0
      },
      season: {
        count: 0,
        dec: 0,
        legendary_potion: 0,
        alchemy_potion: 0,
        cards: {
          stand: {
            1: {
              count: 0,
              dec: 0
            },
            2: {
              count: 0,
              dec: 0
            },
            3: {
              count: 0,
              dec: 0
            },
            4: {
              count: 0,
              dec: 0
            },
            total: {
              count: 0,
              dec: 0
            }
          },
          gold: {
            1: {
              count: 0,
              dec: 0
            },
            2: {
              count: 0,
              dec: 0
            },
            3: {
              count: 0,
              dec: 0
            },
            4: {
              count: 0,
              dec: 0
            },
            total: {
              count: 0,
              dec: 0
            }
          }
        },
        untamed_packs: 0
      }
    }
  },
  cards: {
    combined: 0,
    burnt: {
      bcx: 0,
      DEC: 0
    },
    bought: {
      count: 0,
    },
    sold: {
      prices: []
    }
  },
  mysteryPotion: {
    bought: 0,
    prizes: []
  },
  tx_types: [],
  tx_ids: [],
  txs: [],
  allCards: []
}

generateSeasonEndTimes();

function generateSeasonEndTimes(params) {
  // season origin
  let x = {
    id: 55,
    YYYY: 2021,
    MM: 1,
    DD: 31,
    HH: `14`
  }

  let hours = [`02`, `08`, `14`, `20`];

  for (let i = 0; i < 240; i++) {
    report_array.season.season_end_times[x.id + i] = `${x.YYYY}-${(x.MM.toString().length == 1) ? `0${x.MM}` : x.MM}-${(x.DD.toString().length == 1) ? `0${x.DD}` : x.DD}T${x.HH}:00:00.000Z`;
    //YYYY MM DD
    if (x.DD == 15) {
      //next half of month
      x.DD = new Date(x.YYYY, x.MM, 0).getDate()
    } else {
      //next month
      x.DD = 15;
      if (x.MM == 12) x.YYYY++, x.MM = 1;
      else x.MM++;
    }
    //HH
    let cycle = hours.indexOf(x.HH);
    x.HH = (cycle == 3) ? hours[0] : hours[cycle + 1];
  }
}