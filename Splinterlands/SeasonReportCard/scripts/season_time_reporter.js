function get_season_string(settings) {
  let season = settings.season["name"].substr(-2);

  let next_season = Date.parse(settings.season["ends"]);
  let remaining_time = next_season - new Date().getTime();

  return `Current Season: ${season}. Time to post for Season ${season - 1}:
   ${Math.floor(remaining_time / (1000 * 60 * 60 * 24))} Days 
   ${Math.floor((remaining_time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs 
   ${Math.floor((remaining_time % (1000 * 60 * 60)) / (1000 * 60))} Min 
   ${Math.floor((remaining_time % (1000 * 60)) / 1000)} Sec.`;
}