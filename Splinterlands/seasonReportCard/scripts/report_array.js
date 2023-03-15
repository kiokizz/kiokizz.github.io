//Data d

let report_array = {
  report: null,
  logInType: `keychainBegin`,
  text_fields: ["title", "textOpening", "performance", /*"top10summoners", "top100monsters", "winratebyruleset",*/ "textRewards", "textClosing"],
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
          name: `Dark Energy Crystals (DEC)`,
          count: 0,
          quantity: 0
        },
        SPS: {
          name: `SplinterShards (SPS)`,
          count: 0,
          quantity: 0
        },
        HIVE: {
          name: `Hive (HIVE)`,
          count: 0,
          quantity: 0
        },
        HBD: {
          name: `Hive Backed Dollars (HBD)`,
          count: 0,
          quantity: 0
        },
        SIM: {
          name: `Sim City (SIM)`,
          count: 0,
          quantity: 0
        },
        ENTRY: {
          name: `Sim City (ENTRY)`,
          count: 0,
          quantity: 0
        },
        CINE: {
          name: `CineTV (CINE)`,
          count: 0,
          quantity: 0
        },
        STMINI: {
          name: `Spring Training 2022 Mini Pack (STMINI)`,
          count: 0,
          quantity: 0
        },
        MYTH: {
          name: `MYTHICAL Farm (MYTH)`,
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
      },
      match_data: [],
      match_data_tally: 0,
      fees: []
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
        sps: 0,
        credits: 0,
        merits: 0,
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
        chaos_packs: 0
      },
      season: {
        count: 0,
        dec: 0,
        credits: 0,
        merits: 0,
        sps: 0,
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
        chaos_packs: 0
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
  dec_transfer_types: [],
  sps_transfer_types: [],
  voucher_transfer_types: [],
  STAKEREWARDS_transfer_types: [],
  tx_ids: [],
  dec_transfer_ids: [],
  sps_transfer_ids: [],
  voucher_transfer_ids: [],
  STAKEREWARDS_transfer_ids: [],
  txs: [],
  dec_transfers: [],
  sps_transfers: [],
  voucher_transfers: [],
  STAKEREWARDS_transfers: [],
  STAKEREWARDS_count: 0,
  modern_stake_rewards: 0,
  wild_stake_rewards: 0,
  season_stake_rewards: 0,
  focus_stake_rewards: 0,
  land_stake_rewards: 0,
  brawl_stake_rewards: 0,
  nightmare_stake_rewards: 0,
  license_stake_rewards: 0,
  allCards: [],
  rental_report_only: false
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
    // From Season 88(?), seasons end on 14:00 hours.
    // x.HH = (cycle == 3) ? hours[0] : hours[cycle + 1];
  }

  // Manual overrides for adjustments
  // Season 55, id:68 due to server migration issues https://discord.com/channels/447924793048825866/451123773882499085/876471197708206090
  report_array.season.season_end_times[68] = "2021-08-16T20:00:00.000Z";
  // we have changed it to make seasons not end on weekends or holidays since there have been technical issues recently and we want the team to be available
  report_array.season.season_end_times[86] = "2022-05-16T14:00:00.000Z";

  // Times provided by @yabapmatt
  report_array.season.season_end_times[93] = "2022-08-31T14:00:00.000Z"
  report_array.season.season_end_times[92] = "2022-08-16T14:00:00.000Z"
  report_array.season.season_end_times[91] = "2022-08-01T14:00:00.000Z"
  report_array.season.season_end_times[90] = "2022-07-13T14:00:00.000Z"
  report_array.season.season_end_times[89] = "2022-06-30T14:00:00.000Z"
  report_array.season.season_end_times[88] = "2022-06-15T14:00:00.000Z"

  // More times added - season's have been adjusted to end on work days
  report_array.season.season_end_times[100] = "2022-12-15T14:00:00.000Z"
  report_array.season.season_end_times[101] = "2022-12-30T14:00:00.000Z"
  report_array.season.season_end_times[102] = "2023-01-16T14:00:00.000Z"
  report_array.season.season_end_times[103] = "2023-01-31T14:00:00.000Z"
  report_array.season.season_end_times[104] = "2023-02-14T14:00:00.000Z"

  report_array.season.season_end_times[105] = "2023-02-28T14:00:00.000Z"
  report_array.season.season_end_times[106] = "2023-03-15T14:00:00.000Z"
}