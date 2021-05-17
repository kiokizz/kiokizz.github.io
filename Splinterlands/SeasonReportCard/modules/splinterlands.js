function create_splinterlands() {

    let settings = false;

    async function load_settings() {
        update_status(`Getting Splinterlands settings.`);
        let url = "https://game-api.splinterlands.com/settings";
        settings = await attempt_get_request(url, 5);
        generateSeasonEndTimes();
        return !!settings;
    }

    function get_season_string() {
        if (!settings) return '';

        let id = settings.season.id;
        let name = settings.season.name;
        let nameNum = name.substring(name.length - 2, name.length);
        let season_start = Date.parse(settings.season.season_end_times[id - 2]);
        let season_end = Date.parse(settings.season.season_end_times[id - 1]);

        return `${id} ${name} ${nameNum} ${season_start} ${season_end}`;
    }

    return {
        load_settings: load_settings,
        get_season_string: get_season_string,
    };

    function generateSeasonEndTimes() {
        if (!settings) return;

        // season origin
        let ref = {
            id: 55,
            YYYY: 2021,
            MM: 1,
            DD: 31,
            HH: `14`
        }
        let hours = [`02`, `08`, `14`, `20`];

        settings.season.season_end_times = [];
        for (let i = 0; i < 240; i++) {
            settings.season.season_end_times[ref.id + i] =
                `${ref.YYYY}-${(ref.MM.toString().length == 1)
                    ? `0${ref.MM}` : ref.MM}-${(ref.DD.toString().length == 1) 
                        ? `0${ref.DD}` : ref.DD}T${ref.HH}:00:00.000Z`;
            //YYYY MM DD
            if (ref.DD == 15) {
                //next half of month
                ref.DD = new Date(ref.YYYY, ref.MM, 0).getDate()
            } else {
                //next month
                ref.DD = 15;
                if (ref.MM == 12) ref.YYYY++, ref.MM = 1;
                else ref.MM++;
            }
            //HH
            let cycle = hours.indexOf(ref.HH);
            ref.HH = (cycle == 3) ? hours[0] : hours[cycle + 1];
        }
    }
}