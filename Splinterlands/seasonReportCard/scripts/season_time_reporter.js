function get_season_string(settings) {
  let next_season = Date.parse(settings.season.ends);
  let remaining_time = next_season - new Date().getTime();

  let season_flavour_text = settings.season["name"];
  let past_season_title = `Ranked Rewards Season ${settings.season.id - 88} Report Card`;
  return `Current Season: ${season_flavour_text}. Time to post for ${past_season_title}:
   ${Math.floor(remaining_time / (1000 * 60 * 60 * 24))} Days 
   ${Math.floor((remaining_time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs 
   ${Math.floor((remaining_time % (1000 * 60 * 60)) / (1000 * 60))} Min 
   ${Math.floor((remaining_time % (1000 * 60)) / 1000)} Sec.`;
}