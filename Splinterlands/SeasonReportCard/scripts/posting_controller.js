function posting_controller() {
  let context = this;

  this.check_details = function () {
    let count = 0;
    report_array.text_fields.forEach(field => {
      document.getElementById(field).style.color = "black";
      if (field !== "title" && document.getElementById(field).value.length < 20) {
        count++;
        document.getElementById(field).style.color = "#ff0000";
      }
    });
    if (count > 1) {
      document.getElementById('post').disabled = false;
      stop_on_error(`Please include more writing in your post.`)
    } else context.post_details();
  }
  this.post_details = function () {
    let tags = document.getElementById("tags").value;
    let tags_array = tags.split(` `).filter(function (el) {
      return el != ``;
    });
    console.log(tags_array);
    let unique_tags = [`splinterstats`, `spt`];
    tags_array.forEach(tag => {
      tag = tag.replace(/[^a-z0-9-+ ]+/g, '');
      tag = tag.toLowerCase();
      if (!unique_tags.includes(tag)) unique_tags.push(tag);
    });

    // Community tag check.
    let community_post = document.getElementById(`tagType`).checked;
    let category = `blog`;
    if (community_post) {
      let community_tag = unique_tags.find(tag => tag.startsWith(`hive-`) && tag.length >= 10 && tag.length < 15);
      if (community_tag !== undefined) {
        category = community_tag;
        unique_tags = unique_tags.filter((tag) => !(tag === community_tag));
        unique_tags.unshift(community_tag);
      } else {
        document.getElementById('post').disabled = false;
        stop_on_error("Please ensure a community tag (hive-xxxxxx) is included in order to post to community.");
        return;
      }
    }

    let author = report_array.player;
    let permlink = report_array.permlink;
    let title = report_array.title;
    let body = report_array.report;
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
          category: category,
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
    
    if (report_array.logInType === `keychainBegin`) {
      hive_keychain.requestBroadcast(
        author,
        broadcast_ops,
        'posting',
        function (response) {
          console.log(response);
          if (response.success) {
            update_status(`Post Submitted to Hive. Opening Splintertalk.io in a few seconds...`);
            setTimeout(() => {
              window.open(`https://www.splintertalk.io/splinterstats/@${author}/${permlink}/`, '_blank');
              update_status(`https://www.splintertalk.io/splinterstats/@${author}/${permlink}/`);
            }, 3000);
          } else {
            document.getElementById('post').disabled = false;
            stop_on_error(`Post failed: ${response.message}`);
          }
        }
      );
    } else if (report_array.logInType === `keyBegin`) {
      hive.broadcast.send({
          operations: broadcast_ops,
          extensions: []
        }, {
          posting: report_array.posting_key
        },
        function (e, r) {
          console.log(`Error: ${e}`, `Result: ${r}`);
          if (r && !e) {
            update_status(`Post Submitted to Hive. Opening Splintertalk.io in a few seconds...`);
            setTimeout(() => {
              window.open(`https://www.splintertalk.io/splinterstats/@${author}/${permlink}/`, '_blank');
              update_status(`https://www.splintertalk.io/splinterstats/@${author}/${permlink}/`);
            }, 3000);
          } else {
            document.getElementById('post').disabled = false;
            stop_on_error(`Post failed: ${e}`);
          }
        });
    } else throw `Error with logInTpye;`
  }
}