function niceData(meta) {
  // give me a metadata.[slp_metadata|slp_settings]
  // return object with useful data about the frame metadata
  try {
    _;
  } catch (err) {
    // running from node
    _ = require('lodash');
  }
  // passed a game
  if (meta.metadata) {
    meta = meta.metadata;
  }
  let stage_id = _.get(meta, 'slp_settings.stageId');

  let p0_code = _.get(meta, 'slp_metadata.players[0].names.code');
  let p1_code = _.get(meta, 'slp_metadata.players[1].names.code');
  let p0_tag = _.get(meta, 'slp_metadata.players[0].names.netplay');
  let p1_tag = _.get(meta, 'slp_metadata.players[1].names.netplay');
  let p0_char = _.get(meta, 'slp_settings.players[0].characterId');
  let p1_char = _.get(meta, 'slp_settings.players[1].characterId');
  let p0_color = _.get(meta, 'slp_settings.players[0].characterColor');
  let p1_color = _.get(meta, 'slp_settings.players[1].characterColor');

  let last_frame = _.get(meta, 'slp_metadata.lastFrame');
  let start_at = _.get(meta, 'slp_metadata.startAt');
  let start_atp = new Date(_.get(meta, 'slp_metadata.startAt'));
  //prettier-ignore
  let settings_tag = [last_frame, p0_code, p1_code, stage_id, p0_char, p1_char, p0_color, p1_color]
    .join('_');
  //prettier-ignore
  let data_pool = {stage_id,p0_code,p1_code,p0_tag,p1_tag,p0_char,p1_char,p0_color,p1_color,last_frame,start_at,settings_tag, start_atp};
  return data_pool;
}

function tsToPaths(ts) {
  // take a timestamp => return icon_paths = [stage, char0, char1]
  const img_basedir = 'web/icon';
  const nice = ts.nice; // chg to info.meta.nice
  console.log(stage_id_info);
  const stage_img = stage_id_info[nice.stage_id].icon;
  let char0_img, char1_img;
  if (Number.isInteger(nice.p0_color) && Number.isInteger(nice.p1_color)) {
    char0_img = char_id_info[nice.p0_char].skins[nice.p0_color];
    char1_img = char_id_info[nice.p1_char].skins[nice.p1_color];
  } else {
    char0_img = char_id_info[nice.p0_char].icon;
    char1_img = char_id_info[nice.p1_char].icon;
  }
  return [ stage_img, char0_img, char1_img ].map((filename) => {
    return path.join(img_basedir, filename);
  });
}

function drawIcons(ctx, imageURL, metadata, done_cb = null) {
  const images = []; /// array to hold images.
  var imageCount = 0; // number of loaded images;
  // function called once all images have loaded.
  function allLoaded() {
    let img;

    const icon_scale = 3;
    img = images[0]; // stage background
    //prettier-ignore
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 640, 480);

    //background for text
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 640, 480 / 2.5);
    ctx.fillStyle = '#ffffff';

    img = images[1]; // char0
    //prettier-ignore
    ctx.drawImage(img, 0, 0, img.width, img.height, 170, 5, img.width * icon_scale, img.height * icon_scale);
    img = images[2]; // char1
    //prettier-ignore
    ctx.drawImage(img, 0, 0, img.width, img.height, 170, 110, img.width * icon_scale, img.height * icon_scale);

    drawWords(ctx, metadata);
    if (done_cb) done_cb();
  }
  imageURL.forEach((src) => {
    // for each image url
    const image = new Image();
    image.src = src;
    image.onload = () => {
      imageCount += 1;
      if (imageCount === imageURL.length) {
        allLoaded();
      }
    };
    images.push(image);
  });
}
function drawWords(ctx, metadata) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(250, 400, 400, 100);
  // time text
  ctx.fillStyle = '#ffffff';
  ctx.font = "22pt 'monospace'";
  const startAt = _.get(metadata, 'slp_metadata.startAt');
  //prettier-ignore
  const bottom_str = new Date(Date.parse(startAt)).toLocaleString();
  ctx.fillText(bottom_str, 260, 450);

  const p0_code = _.get(metadata, 'slp_metadata.players[0].names.code');
  ctx.fillText(p0_code, 10, 60);
  const p0_tag = _.get(metadata, 'slp_metadata.players[0].names.netplay');
  ctx.fillText(p0_tag, 270, 60);

  const p1_code = _.get(metadata, 'slp_metadata.players[1].names.code');
  ctx.fillText(p1_code, 10, 170);
  const p1_tag = _.get(metadata, 'slp_metadata.players[1].names.netplay');
  ctx.fillText(p1_tag, 270, 170);
}

function canvasToBody() {
  let canvas = document.querySelector('canvas');
  const imageHTML = '<img src="' + canvas.toDataURL() + '" />';
  $('#crt_img').attr('src', canvas.toDataURL());
}

function drawMetaToScreen(metadata) {
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');
  const icon_paths = metaToIconPaths(metadata);
  drawIcons(ctx, icon_paths, metadata, canvasToBody);
}

function metaToIconPaths(metadata) {
  const { p0_char, p0_color, p1_char, p1_color } = niceData(metadata);
  const { stage_id_info, char_id_info } = infos;
  const nice = niceData(metadata); // chg to info.meta.nice
  const stage_img = stage_id_info[nice.stage_id].icon;
  let char0_img = char_id_info[nice.p0_char].skins[nice.p0_color];
  let char1_img = char_id_info[nice.p1_char].skins[nice.p1_color];

  return [ stage_img, char0_img, char1_img ].map((filename) => {
    return '/icon/' + filename;
  });
}

function previewIdx(idx) {
  const metadata = window.rows[idx].metadata;
  drawMetaToScreen(metadata);
}
const insertSortedBy = (a, v, f) => a.splice(_.sortedIndexBy(a, v, f), 0, v);

function partitionRowsBySet(rows) {
  // returns [[g0,g1], [g2,g3,g4], ... ] by set
  let row_copy = _.cloneDeep(rows);
  // allow player 1 and player 2 to switch (on reconnect?)
  const codes_sorted = (g) => {
    return [ g.nice.p0_code, g.nice.p1_code ].sort().join('_');
  };
  const timeDelta = (t0, t1) => {
    return Math.abs(Date.parse(t0) - Date.parse(t1));
  };
  const dp = (t) => Date.parse(t);
  row_copy = row_copy.map((game) => {
    game.nice = niceData(game.metadata);
    game.codes_sorted = codes_sorted(game);
    return game;
  });
  let global_games_by_codes = {};
  // {kb#umar: [g0,g1], bobo#smilo: [g0, g1], ...}
  // sort all game chronologically per tag
  for (const game of row_copy) {
    const codes = game.codes_sorted;
    if (!_.has(global_games_by_codes, codes)) {
      global_games_by_codes[codes] = { chron: [], codes, part: [] };
    }
    gameArr = global_games_by_codes[codes].chron;
    gameArr = insertSortedBy(gameArr, game, (e) => {
      return dp(e.start_at);
    });
  }
  const split_by_times = (gameArr) => {
    // splits chronological games by time
    let partitions = [];
    let cur_set = [];
    _.forEach(gameArr, (game, idx) => {
      // go oldest to newest
      if (_.isEmpty(cur_set)) {
        cur_set.push(game);
        return true; // continue
      }
      const _last = _.last(cur_set); // newest game in the set
      const time_limit = 1000 * 60 * 20; // 20 min between games. what about losers to winners finals
      const time_diff = timeDelta(_last.start_at, game.start_at);
      if (time_diff > time_limit) {
        partitions.push(cur_set);
        cur_set = [ game ];
        return true; // continue
      }
      if (time_diff < 1000 * 5) {
        //prettier-ignore
        console.log('same game? (same players,  less than 5 sec apart)\non:\n', _last.id, ',', game.id);
      }
      const maximum_games_per_set = 5;
      if (cur_set.length >= maximum_games_per_set) {
        // only allow 5 games per set
        partitions.push(cur_set);
        cur_set = [ game ];
        return true; // continue
      }
      // all checks passed?
      cur_set.push(game);
    });
    if (!_.isEmpty(cur_set)) {
      partitions.push(cur_set);
    }
    return partitions;
  };
  global_sets = [];
  _.each(global_games_by_codes, (obj, codes) => {
    _.each(split_by_times(obj.chron), (set_part) => {
      // each set per player codes
      let game1 = set_part[0];
      let set = {
        start_atp : game1.nice.start_atp,
        games     : set_part
      };
      insertSortedBy(global_sets, set, (e) => e.start_atp);
    });
  });
  return global_sets;
}

function setToHtmls(set) {}

// prettier-ignore
const infos = {"icon_basedir":"web/icon","char_id_info":{"0":{"name":"Captain_Falcon","skin":["original","black","red","white","green","blue"],"icon":"captain-original.png","skins":["captain-original.png","captain-black.png","captain-red.png","captain-white.png","captain-green.png","captain-blue.png"]},"1":{"name":"Donkey_Kong","skin":["original","black","red","blue","green"],"icon":"donkey-original.png","skins":["donkey-original.png","donkey-black.png","donkey-red.png","donkey-blue.png","donkey-green.png"]},"2":{"name":"Fox","skin":["original","red","blue","green"],"icon":"fox-original.png","skins":["fox-original.png","fox-red.png","fox-blue.png","fox-green.png"]},"3":{"name":"Game_And_Watch","skin":["original","red","blue","green"],"icon":"gamewatch-original.png","skins":["gamewatch-original.png","gamewatch-red.png","gamewatch-blue.png","gamewatch-green.png"]},"4":{"name":"Kirby","skin":["original","yellow","blue","red","green","white"],"icon":"kirby-original.png","skins":["kirby-original.png","kirby-yellow.png","kirby-blue.png","kirby-red.png","kirby-green.png","kirby-white.png"]},"5":{"name":"Bowser","skin":["green","red","blue","black"],"icon":"koopa-green.png","skins":["koopa-green.png","koopa-red.png","koopa-blue.png","koopa-black.png"]},"6":{"name":"Link","skin":["green","red","blue","black","white"],"icon":"link-green.png","skins":["link-green.png","link-red.png","link-blue.png","link-black.png","link-white.png"]},"7":{"name":"Luigi","skin":["green","white","blue","red"],"icon":"luigi-green.png","skins":["luigi-green.png","luigi-white.png","luigi-blue.png","luigi-red.png"]},"8":{"name":"Mario","skin":["red","yellow","black","blue","green"],"icon":"mario-red.png","skins":["mario-red.png","mario-yellow.png","mario-black.png","mario-blue.png","mario-green.png"]},"9":{"name":"Marth","skin":["original","red","green","black","white"],"icon":"marth-original.png","skins":["marth-original.png","marth-red.png","marth-green.png","marth-black.png","marth-white.png"]},"10":{"name":"Mewtwo","skin":["original","red","blue","green"],"icon":"mewtwo-original.png","skins":["mewtwo-original.png","mewtwo-red.png","mewtwo-blue.png","mewtwo-green.png"]},"11":{"name":"Ness","skin":["original","yellow","blue","green"],"icon":"ness-original.png","skins":["ness-original.png","ness-yellow.png","ness-blue.png","ness-green.png"]},"12":{"name":"Peach","skin":["original","daisy","white","blue","green"],"icon":"peach-original.png","skins":["peach-original.png","peach-daisy.png","peach-white.png","peach-blue.png","peach-green.png"]},"13":{"name":"Pikachu","skin":["original","red","blue","green"],"icon":"pikachu-original.png","skins":["pikachu-original.png","pikachu-red.png","pikachu-blue.png","pikachu-green.png"]},"14":{"name":"Ice_Climbers","skin":["original","green","orange","red"],"icon":"ice_climber-original.png","skins":["ice_climber-original.png","ice_climber-green.png","ice_climber-orange.png","ice_climber-red.png"]},"15":{"name":"Jigglypuff","skin":["original","red","blue","green","crown"],"icon":"purin-original.png","skins":["purin-original.png","purin-red.png","purin-blue.png","purin-green.png","purin-crown.png"]},"16":{"name":"Samus","skin":["red","pink","black","green","blue"],"icon":"samus-red.png","skins":["samus-red.png","samus-pink.png","samus-black.png","samus-green.png","samus-blue.png"]},"17":{"name":"Yoshi","skin":["green","red","blue","yellow","pink","light_blue"],"icon":"yoshi-green.png","skins":["yoshi-green.png","yoshi-red.png","yoshi-blue.png","yoshi-yellow.png","yoshi-pink.png","yoshi-light_blue.png"]},"18":{"name":"Zelda","skin":["original","red","blue","green","white"],"icon":"zelda-original.png","skins":["zelda-original.png","zelda-red.png","zelda-blue.png","zelda-green.png","zelda-white.png"]},"19":{"name":"Sheik","skin":["original","red","blue","green","white"],"icon":"sheik-original.png","skins":["sheik-original.png","sheik-red.png","sheik-blue.png","sheik-green.png","sheik-white.png"]},"20":{"name":"Falco","skin":["original","red","blue","green"],"icon":"falco-original.png","skins":["falco-original.png","falco-red.png","falco-blue.png","falco-green.png"]},"21":{"name":"Young_Link","skin":["green","red","blue","white","black"],"icon":"younglink-green.png","skins":["younglink-green.png","younglink-red.png","younglink-blue.png","younglink-white.png","younglink-black.png"]},"22":{"name":"Dr_Mario","skin":["white","red","blue","green","black"],"icon":"mariod-red.png","skins":["mariod-white.png","mariod-red.png","mariod-blue.png","mariod-green.png","mariod-black.png"]},"23":{"name":"Roy","skin":["original","red","blue","green","yellow"],"icon":"roy-original.png","skins":["roy-original.png","roy-red.png","roy-blue.png","roy-green.png","roy-yellow.png"]},"24":{"name":"Pichu","skin":["original","red","blue","green"],"icon":"pichu-original.png","skins":["pichu-original.png","pichu-red.png","pichu-blue.png","pichu-green.png"]},"25":{"name":"Ganondorf","skin":["original","red","blue","green","purple"],"icon":"ganon-original.png","skins":["ganon-original.png","ganon-red.png","ganon-blue.png","ganon-green.png","ganon-purple.png"]},"26":{"name":"Master_Hand","icon":"master_hand.png"},"27":{"name":"Wireframe_Male","icon":"wireframe.png"},"28":{"name":"Wireframe_Female","icon":"wireframe.png"},"29":{"name":"Giga_Bowser","icon":"giga_bowser.png"},"30":{"name":"Crazy_Hand","icon":"crazy_hand.png"},"31":{"name":"Sandbag","icon":"yoshi-blue.png"},"32":{"name":"Popo","icon":"ice_climber-original.png"}},"stage_id_info":{"2":{"dir_name":"fountain","stage_name":"Fountain of Dreams","icon":"fountain.png"},"3":{"dir_name":"stadium","stage_name":"Pok??mon Stadium","icon":"stadium.png"},"4":{"stage_name":"PRINCESS_PEACHS_CASTLE"},"5":{"stage_name":"KONGO_JUNGLE"},"6":{"stage_name":"BRINSTAR"},"7":{"stage_name":"CORNERIA"},"8":{"dir_name":"yoshis","stage_name":"Yoshi's Story","icon":"yoshis.png"},"9":{"stage_name":"ONETT"},"10":{"stage_name":"MUTE_CITY"},"11":{"stage_name":"RAINBOW_CRUISE"},"12":{"stage_name":"JUNGLE_JAPES"},"13":{"stage_name":"GREAT_BAY"},"14":{"stage_name":"HYRULE_TEMPLE"},"15":{"stage_name":"BRINSTAR_DEPTHS"},"16":{"stage_name":"YOSHIS_ISLAND"},"17":{"stage_name":"GREEN_GREENS"},"18":{"stage_name":"FOURSIDE"},"19":{"stage_name":"MUSHROOM_KINGDOM_I"},"20":{"stage_name":"MUSHROOM_KINGDOM_II"},"22":{"stage_name":"VENOM"},"23":{"stage_name":"POKE_FLOATS"},"24":{"stage_name":"BIG_BLUE"},"25":{"stage_name":"ICICLE_MOUNTAIN"},"26":{"stage_name":"ICETOP"},"27":{"stage_name":"FLAT_ZONE"},"28":{"dir_name":"dreamland","stage_name":"Dream Land","icon":"dreamland.png"},"29":{"stage_name":"YOSHIS_ISLAND_N64"},"30":{"stage_name":"KONGO_JUNGLE_N64"},"31":{"dir_name":"battlefield","stage_name":"Battlefield","icon":"battlefield.png"},"32":{"dir_name":"final","stage_name":"Final Destination","icon":"final.png"}}}

try {
  module.exports = { niceData, partitionRowsBySet };
} catch (e) {}
