function posting_controller() {
  let context = this;

  this.post_details = function () {
    let tags = document.getElementById("tags").value;
    let tags_array = tags.split(` `).filter(function (el) {
      return el != ``;
    });
    console.log(tags_array);
    let unique_tags = [`splinterstats`, `spt`];
    tags_array.forEach(tag => {
      if (!unique_tags.includes(tag)) unique_tags.push(tag);
    });

    let author = report_array.player;
    let permlink = `splinterstats-season-${report_array.season.nameNum - 1}-report-card`;
    let title = `Splinter Stats Season ${report_array.season.nameNum - 1} Report Card`;
    let body = report_array.report ;
    let beneficiaries = [];
    beneficiaries.push({
      account: 'splinterstats',
      weight: 1000
    });

    let broadcast_ops = [
      ['comment',
        {
          parent_author: '',
          parent_permlink: unique_tags[0],
          author: author,
          permlink: permlink,
          title: title,
          body: body,
          json_metadata: JSON.stringify({
            tags: unique_tags,
            app: 'SplinterStats/2020.12.19'
          })
        }
      ],
      ['comment_options', {
        author: author,
        permlink: permlink,
        max_accepted_payout: '100000.000 HBD',
        percent_hbd: 10000,
        allow_votes: true,
        allow_curation_rewards: true,
        extensions: [
          [0, {
            beneficiaries: beneficiaries
          }]
        ]
      }]
    ];

    console.log(broadcast_ops)
    
    hive_keychain.requestBroadcast(
      author,
      broadcast_ops,
      'posting',
      function(response) {
        console.log(response);
        if (response.success) {
          context.update_status(`Post Submitted to Hive`);
        } else context.stop_on_error(`Post failed: ${response.message}`);
      }
    );
  }
}