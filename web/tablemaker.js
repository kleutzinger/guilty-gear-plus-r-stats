function redraw_table(sets) {
  populateTable(sets);
}

function populateTable(sets) {
  addDataToSets(sets);
  var table = new Tabulator('#tabulator', {
    data          : _.shuffle(sets), //assign data to table
    // prettier-ignore
    columns: genColumns(),
    cellVertAlign : 'middle',
    // layout      : 'fitColumns',
    initialSort   : [
      //set the initial sort order of the data
      { column: 'start_atp', dir: 'desc' }
    ]
  });
}

function genColumns() {
  return [
    {
      title           : 'Time',
      field           : 'start_atp',
      sorter          : 'datetime',
      formatter       : 'datetime',
      formatterParams : {
        // inputFormat        : 'YYYY-MM-DD HH:ii',
        outputFormat       : 'MMM Do, YYYY',
        invalidPlaceholder : '(invalid date)'
        // timezone           : 'America/Los_Angeles'
      }
    },
    {
      title           : 'Played',
      field           : 'start_at2',
      formatter       : 'datetimediff',
      formatterParams : {
        // inputFormat        : 'YYYY-MM-DD',
        humanize           : true,
        suffix             : true,
        invalidPlaceholder : '(invalid date)'
      }
    },
    { title: 'P1', field: 'P1', formatter: 'html' },
    { title: 'P2', field: 'P2', formatter: 'html' },
    { title: 'CHAR', field: 'CHAR', formatter: 'html' },
    { title: 'G1', field: 'G1', hozAlign: 'center', formatter: gm_fmt },
    { title: 'G2', field: 'G2', hozAlign: 'center', formatter: gm_fmt },
    { title: 'G3', field: 'G3', hozAlign: 'center', formatter: gm_fmt },
    { title: 'G4', field: 'G4', hozAlign: 'center', formatter: gm_fmt },
    { title: 'G5', field: 'G5', hozAlign: 'center', formatter: gm_fmt }
  ];
}

function gm_fmt(cell, formatterParams, onRendered) {
  const val = cell.getValue();
  if (!val) return;
  const ret = `
  <a href="${val.dl_url}"><img class='infoImage' src="${val.icon}"></img></a>
  `;
  return ret;
}

function addDataToSets(sets) {
  return _.map(sets, (set) => {
    const game1 = set.games[0];
    set.start_at2 = moment(game1.start_at);
    set.P1 = game1.nice.p0_tag;
    set.P2 = game1.nice.p1_tag;
    set.CHAR = game2chars(game1);
    let game_num = 1;
    for (const game of set.games) {
      set['G' + game_num] = { icon: game2stg(game), dl_url: game.dl_url };
      game_num += 1;
    }
    return set;
  });
}

function game2stg(game) {
  return '/icon/' + stage_id_info[game.nice.stage_id].icon_small;
}

function game2chars(game) {
  const nice = game.nice;
  let char0_img = '/icon/' + char_id_info[nice.p0_char].skins[nice.p0_color];
  let char1_img = '/icon/' + char_id_info[nice.p1_char].skins[nice.p1_color];
  const html = `
  <span>
  <img class='infoImage' src="${char0_img}"></img>
  <img class='infoImage' src="${char1_img}"></img>
  </span>
  `;
  return html;
  // url1 = [game.nice.p0_char]
}
// prettier-ignore
const {stage_id_info, char_id_info} ={"icon_basedir":"web/icon","char_id_info":{"0":{"name":"Captain_Falcon","skin":["original","black","red","white","green","blue"],"icon":"captain-original.png","skins":["captain-original.png","captain-black.png","captain-red.png","captain-white.png","captain-green.png","captain-blue.png"]},"1":{"name":"Donkey_Kong","skin":["original","black","red","blue","green"],"icon":"donkey-original.png","skins":["donkey-original.png","donkey-black.png","donkey-red.png","donkey-blue.png","donkey-green.png"]},"2":{"name":"Fox","skin":["original","red","blue","green"],"icon":"fox-original.png","skins":["fox-original.png","fox-red.png","fox-blue.png","fox-green.png"]},"3":{"name":"Game_And_Watch","skin":["original","red","blue","green"],"icon":"gamewatch-original.png","skins":["gamewatch-original.png","gamewatch-red.png","gamewatch-blue.png","gamewatch-green.png"]},"4":{"name":"Kirby","skin":["original","yellow","blue","red","green","white"],"icon":"kirby-original.png","skins":["kirby-original.png","kirby-yellow.png","kirby-blue.png","kirby-red.png","kirby-green.png","kirby-white.png"]},"5":{"name":"Bowser","skin":["green","red","blue","black"],"icon":"koopa-green.png","skins":["koopa-green.png","koopa-red.png","koopa-blue.png","koopa-black.png"]},"6":{"name":"Link","skin":["green","red","blue","black","white"],"icon":"link-green.png","skins":["link-green.png","link-red.png","link-blue.png","link-black.png","link-white.png"]},"7":{"name":"Luigi","skin":["green","white","blue","red"],"icon":"luigi-green.png","skins":["luigi-green.png","luigi-white.png","luigi-blue.png","luigi-red.png"]},"8":{"name":"Mario","skin":["red","yellow","black","blue","green"],"icon":"mario-red.png","skins":["mario-red.png","mario-yellow.png","mario-black.png","mario-blue.png","mario-green.png"]},"9":{"name":"Marth","skin":["original","red","green","black","white"],"icon":"marth-original.png","skins":["marth-original.png","marth-red.png","marth-green.png","marth-black.png","marth-white.png"]},"10":{"name":"Mewtwo","skin":["original","red","blue","green"],"icon":"mewtwo-original.png","skins":["mewtwo-original.png","mewtwo-red.png","mewtwo-blue.png","mewtwo-green.png"]},"11":{"name":"Ness","skin":["original","yellow","blue","green"],"icon":"ness-original.png","skins":["ness-original.png","ness-yellow.png","ness-blue.png","ness-green.png"]},"12":{"name":"Peach","skin":["original","daisy","white","blue","green"],"icon":"peach-original.png","skins":["peach-original.png","peach-daisy.png","peach-white.png","peach-blue.png","peach-green.png"]},"13":{"name":"Pikachu","skin":["original","red","blue","green"],"icon":"pikachu-original.png","skins":["pikachu-original.png","pikachu-red.png","pikachu-blue.png","pikachu-green.png"]},"14":{"name":"Ice_Climbers","skin":["original","green","orange","red"],"icon":"ice_climber-original.png","skins":["ice_climber-original.png","ice_climber-green.png","ice_climber-orange.png","ice_climber-red.png"]},"15":{"name":"Jigglypuff","skin":["original","red","blue","green","crown"],"icon":"purin-original.png","skins":["purin-original.png","purin-red.png","purin-blue.png","purin-green.png","purin-crown.png"]},"16":{"name":"Samus","skin":["red","pink","black","green","blue"],"icon":"samus-red.png","skins":["samus-red.png","samus-pink.png","samus-black.png","samus-green.png","samus-blue.png"]},"17":{"name":"Yoshi","skin":["green","red","blue","yellow","pink","light_blue"],"icon":"yoshi-green.png","skins":["yoshi-green.png","yoshi-red.png","yoshi-blue.png","yoshi-yellow.png","yoshi-pink.png","yoshi-light_blue.png"]},"18":{"name":"Zelda","skin":["original","red","blue","green","white"],"icon":"zelda-original.png","skins":["zelda-original.png","zelda-red.png","zelda-blue.png","zelda-green.png","zelda-white.png"]},"19":{"name":"Sheik","skin":["original","red","blue","green","white"],"icon":"sheik-original.png","skins":["sheik-original.png","sheik-red.png","sheik-blue.png","sheik-green.png","sheik-white.png"]},"20":{"name":"Falco","skin":["original","red","blue","green"],"icon":"falco-original.png","skins":["falco-original.png","falco-red.png","falco-blue.png","falco-green.png"]},"21":{"name":"Young_Link","skin":["green","red","blue","white","black"],"icon":"younglink-green.png","skins":["younglink-green.png","younglink-red.png","younglink-blue.png","younglink-white.png","younglink-black.png"]},"22":{"name":"Dr_Mario","skin":["white","red","blue","green","black"],"icon":"mariod-red.png","skins":["mariod-white.png","mariod-red.png","mariod-blue.png","mariod-green.png","mariod-black.png"]},"23":{"name":"Roy","skin":["original","red","blue","green","yellow"],"icon":"roy-original.png","skins":["roy-original.png","roy-red.png","roy-blue.png","roy-green.png","roy-yellow.png"]},"24":{"name":"Pichu","skin":["original","red","blue","green"],"icon":"pichu-original.png","skins":["pichu-original.png","pichu-red.png","pichu-blue.png","pichu-green.png"]},"25":{"name":"Ganondorf","skin":["original","red","blue","green","purple"],"icon":"ganon-original.png","skins":["ganon-original.png","ganon-red.png","ganon-blue.png","ganon-green.png","ganon-purple.png"]},"26":{"name":"Master_Hand","icon":"master_hand.png"},"27":{"name":"Wireframe_Male","icon":"wireframe.png"},"28":{"name":"Wireframe_Female","icon":"wireframe.png"},"29":{"name":"Giga_Bowser","icon":"giga_bowser.png"},"30":{"name":"Crazy_Hand","icon":"crazy_hand.png"},"31":{"name":"Sandbag","icon":"yoshi-blue.png"},"32":{"name":"Popo","icon":"ice_climber-original.png"}},"stage_id_info":{"2":{"dir_name":"fountain","stage_name":"Fountain of Dreams","icon":"fountain.png","icon_small":"fountain_small.png"},"3":{"dir_name":"stadium","stage_name":"Pok??mon Stadium","icon":"stadium.png","icon_small":"stadium_small.png"},"4":{"stage_name":"PRINCESS_PEACHS_CASTLE"},"5":{"stage_name":"KONGO_JUNGLE"},"6":{"stage_name":"BRINSTAR"},"7":{"stage_name":"CORNERIA"},"8":{"dir_name":"yoshis","stage_name":"Yoshi's Story","icon":"yoshis.png","icon_small":"yoshis_small.png"},"9":{"stage_name":"ONETT"},"10":{"stage_name":"MUTE_CITY"},"11":{"stage_name":"RAINBOW_CRUISE"},"12":{"stage_name":"JUNGLE_JAPES"},"13":{"stage_name":"GREAT_BAY"},"14":{"stage_name":"HYRULE_TEMPLE"},"15":{"stage_name":"BRINSTAR_DEPTHS"},"16":{"stage_name":"YOSHIS_ISLAND"},"17":{"stage_name":"GREEN_GREENS"},"18":{"stage_name":"FOURSIDE"},"19":{"stage_name":"MUSHROOM_KINGDOM_I"},"20":{"stage_name":"MUSHROOM_KINGDOM_II"},"22":{"stage_name":"VENOM"},"23":{"stage_name":"POKE_FLOATS"},"24":{"stage_name":"BIG_BLUE"},"25":{"stage_name":"ICICLE_MOUNTAIN"},"26":{"stage_name":"ICETOP"},"27":{"stage_name":"FLAT_ZONE"},"28":{"dir_name":"dreamland","stage_name":"Dream Land","icon":"dreamland.png","icon_small":"dreamland_small.png"},"29":{"stage_name":"YOSHIS_ISLAND_N64"},"30":{"stage_name":"KONGO_JUNGLE_N64"},"31":{"dir_name":"battlefield","stage_name":"Battlefield","icon":"battlefield.png","icon_small":"battlefield_small.png"},"32":{"dir_name":"final","stage_name":"Final Destination","icon":"final.png","icon_small":"final_small.png"}}}
