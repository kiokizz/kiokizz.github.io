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
  survival_stake_rewards: 0,
  season_stake_rewards: 0,
  focus_stake_rewards: 0,
  land_stake_rewards: 0,
  brawl_stake_rewards: 0,
  nightmare_stake_rewards: 0,
  license_stake_rewards: 0,
  allCards: [],
  rental_report_only: false,
  GLINT_transfer_types: [],
  GLINT_transfer_ids: [],
  GLINT_transfers: []
}