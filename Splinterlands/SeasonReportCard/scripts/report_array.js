//Data d

let report_array = {
  report: null,
  logInType: `keychainBegin`,
  text_fields: ["title", "textOpening", "performance", "top10summoners", "top100monsters", "winratebyruleset", "textRewards", "textClosing"],
  season: {
    nameNum: 0,
    date_start: undefined,
    date_end: undefined,
    season_end_times_manual: {
      50: "2020-11-15T20:00:00.000Z",
      51: "2020-11-30T14:00:00.000Z",
      52: "2020-12-15T20:00:00.000Z",
      53: "2020-12-31 02:00:00.000Z",
      54: "2021-01-15T08:00:00.000Z",
      formulaeToImplement: `np, the formula for season ends is it's the 15th and the last day of the month and it changes the time by 6 hours each time
      so next season end is 2021-01-15 08:00:00Z, then 2021-01-31 14:00:00Z`
    }
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
      wins: 0,
      loss: 0,
      draws: 0,
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
    prizes: [],
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