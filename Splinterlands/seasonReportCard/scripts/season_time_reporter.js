function get_season_string(settings) {
  let season_id = settings.season.id - 13;

  let next_season = Date.parse(settings.season["ends"]);
  let remaining_time = next_season - new Date().getTime();

  let season_flavour_text = settings.season["name"];
  if (season_id === 74 || season_id === 75) season_flavour_text = `Ranked Rewards Season 1 (${season_id})`
  return `Current Season: ${season_flavour_text}. Time to post for Season ${season_id - 1}:
   ${Math.floor(remaining_time / (1000 * 60 * 60 * 24))} Days 
   ${Math.floor((remaining_time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs 
   ${Math.floor((remaining_time % (1000 * 60 * 60)) / (1000 * 60))} Min 
   ${Math.floor((remaining_time % (1000 * 60)) / 1000)} Sec.`;
}