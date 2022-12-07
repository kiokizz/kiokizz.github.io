let documentation = {
  general: [],
  player: [],
  market: [],
  gameplay: [],
  tournaments: [],
  guilds: []
}

let sample_data = {
  id: ``,
  name: ``,
  link: ``,
  link_text: ``,
  description: ``,
  parameters: [[]],
  formatted_output: ``
}

// Settings
documentation.general.push({
  id: `settings`,
  name: `Settings`,
  link: `https://api2.splinterlands.com/settings`,
  link_text: `/settings`,
  description: `A collection of sundry game data and price feeds.`,
  parameters: [],
  formatted_output: `{
    ...
    combine_rates: [...],
    core_editions: [0, 1, 4, 7],
    daily_quests: [{name: "lyanna",...],
    dec_price: 0.0007422,
    ...
}`
})

// Price

// TODO https://prices.splinterlands.com/prices

// Look Up Transaction
documentation.general.push({
  id: `lookup`,
  name: `Look Up Transaction`,
  link: `https://api.splinterlands.io/transactions/lookup?trx_id=09c8ac9db08d246696fa795cbf03ff07b83303e6`,
  link_text: `/lookup?trx_id=09c8...03e6`,
  description: `Look up a specific transaction using the associated hive blockchain transaction id.`,
  parameters: [[`trx_id`, `09c8ac9db08d246696fa795cbf03ff07b83303e6`, true]],
  formatted_output: `{
    block_id: "0242021dc93ce1ccca2794d7b58bf2e8c431465c",
    block_num: 37880349,
    created_date: "2019-11-04T12:46:55.560Z",
    data: "{"type":"daily"}",
    error: null,
    id: "09c8ac9db08d246696fa795cbf03ff07b83303e6",
    player: "buffnecked-ibis",
    prev_block_id: "0242021c1db4e5e4c31b7d5ff819352194e7d400",
    result: "{…}",
    sbd_price: "0.717364",
    steem_price: "0.149986",
    success: true,
    type: "sm_start_quest"
}`
})


// Transaction History
documentation.general.push({
  id: `general-history`,
  name: `Transaction History`,
  link: `https://api.splinterlands.io/transactions/history`,
  link_text: `/transactions/history`,
  description: `Look up a specific transaction using the associated hive blockchain transaction id.`,
  parameters: [[`from_block`, `37904629`, false]],
  formatted_output: `{
    ...
    ...
}`
})

// Global Card Stats
documentation.general.push({
  id: `stats`,
  name: `Global Card Stats`,
  link: `https://api.splinterlands.io/cards/stats`,
  link_text: `/cards/stats`,
  description: `Card circulation data for all cards displayed by id and foil.`,
  parameters: [],
  formatted_output: `{
    card_detail_id: 1
    edition: 0
    gold: false
    num_burned: "159"
    num_cards: "8026"
    total_burned_xp: "5540"
    total_xp: "879140"
}`
})

// Card Details
documentation.general.push({
  id: ``,
  name: `Card Details`,
  link: `https://api.splinterlands.io/cards/get_details`,
  link_text: `cards/get_details`,
  description: `Get card details for all cards.`,
  parameters: [],
  formatted_output: `{
    color: "Red"
    created_block_num: null
    distribution: […]
    drop_rate: 80
    editions: "0,1"
    id: 1
    is_starter: false
    last_update_tx: null
    name: "Goblin Shaman"
    rarity: 1
    stats: {…}
    sub_type: null
    total_printed: 174855
    type: "Monster"
}`
})

// Player Collection - move to Player section?
documentation.general.push({
  id: ``,
  name: `Player Collection`,
  link: `https://api.splinterlands.io/cards/find?ids=C3-79-UUT7TSLVN4`,
  link_text: `cards/find?ids=C3-79-UUT7TSLVN4`,
  description: `Search for a specific card by unique id.`,
  parameters: [],
  formatted_output: `{
    alpha_xp: null
    buy_price: null
    card_detail_id: 79
    delegated_to: null
    delegation_tx: null
    details: {…}
    edition: 3
    gold: false
    last_transferred_block: 36440204
    last_used_block: 36300473
    market_id: null
    player: "kiokizz"
    skin: null
    uid: "C3-79-UUT7TSLVN4"
    xp: 0
}`
})

// Check Promo Code
documentation.general.push({
  id: ``,
  name: `Check Promo Code`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Purchase Settings
documentation.market.push({
  id: ``,
  name: `Purchase Settings`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Market Listings - All
documentation.market.push({
  id: ``,
  name: `Market Listings - All`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Grouped Market Listings - Summary
documentation.market.push({
  id: ``,
  name: `Grouped Market Listings`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Market Transaction Lookup
documentation.market.push({
  id: ``,
  name: `Market Transaction Lookup`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Player Market Sale History
documentation.market.push({
  id: ``,
  name: `Player Market Sale History`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Card Pack Purchase Lookup
documentation.market.push({
  id: ``,
  name: `Card Pack Purchase Lookup`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Leaderboard - Current Season
documentation.gameplay.push({
  id: ``,
  name: `Leaderboard - Current Season`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Leaderboard - Previous Season
documentation.gameplay.push({
  id: ``,
  name: `Leaderboard - Previous Season`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Top - Last 50 Matches
documentation.gameplay.push({
  id: ``,
  name: `Top - Last 50 Matches`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Player - Last 50 Matches
documentation.gameplay.push({
  id: ``,
  name: `Player - Last 50 Matches`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Battle Transaction Lookup
documentation.gameplay.push({
  id: ``,
  name: `Battle Transaction Lookup`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Ongoing Match - Player
documentation.gameplay.push({
  id: ``,
  name: `Ongoing Match - Player`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})


// Upcoming Tournaments
documentation.tournaments.push({
  id: ``,
  name: `Upcoming Tournaments`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Tournaments in Progress
documentation.tournaments.push({
  id: ``,
  name: `Tournaments in Progress`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Completed Tournaments
documentation.tournaments.push({
  id: ``,
  name: `Completed Tournaments`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Tournament Lookup
documentation.tournaments.push({
  id: ``,
  name: `Tournament Lookup`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Tournament Round Results
documentation.tournaments.push({
  id: ``,
  name: `Tournament Round Results`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Get Player Balances
documentation.player.push({
  id: ``,
  name: `Get Player Balances`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Player Settings - General
documentation.player.push({
  id: ``,
  name: `Player Settings - General`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Player Settings - Login
documentation.player.push({
  id: ``,
  name: `Player Settings - Login`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Player Quest
documentation.player.push({
  id: ``,
  name: `Player Quest`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Referrals
documentation.player.push({
  id: ``,
  name: `Referrals`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})


// Guild Members
documentation.guilds.push({
  id: ``,
  name: `Guild Members`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})

// Guild Lookup
documentation.guilds.push({
  id: ``,
  name: `Guild Lookup`,
  link: ``,
  link_text: ``,
  description: `description`,
  parameters: [],
  formatted_output: `{
    ...
    ...
}`
})
