var cards_colors =  {
                    '3': '#B1E6FA',
                    '4': '#99DDF8',
                    '5': '#7FD4F5',
                    '6': '#67CDF5',
                    '7': '#4EC6F5',
                    '8': '#36BFF5',
                    '9': '#1DB8F5',
                    '10': '#05B1F5',
                    '11': '#55BE41',
                    '12': '#65C431',
                    '13': '#82CC2B',
                    '14': '#97D124',
                    '15': '#B1DA18',
                    '16': '#CCE119',
                    '17': '#F4E70F',
                    '18': '#FEED0D',
                    '19': '#FCDB1B',
                    '20': '#FECE08',
                    '21': '#F7B10D',
                    '22': '#F4A90C',
                    '23': '#F59211',
                    '24': '#F27718',
                    '25': '#F0611E',
                    '26': '#EE481C',
                    '27': '#E1351A',
                    '28': '#DE021C',
                    '29': '#CC0813',
                    '30': '#BD0000',
                    '31': '#9622B2',
                    '32': '#791D8F',
                    '33': '#701E81',
                    '34': '#4A1D70',
                    '35': '#360E57',
                    }
function custom_card(card) {
  var SVG = card.getSVGDocument();
  var texts = SVG.getElementsByTagName("tspan");
  var num = card.id.split('-')[1];
  for (var i=0; i<texts.length; i++) texts[i].textContent = num;
  if (num in cards_colors) { var color = cards_colors[num] } else { var color = '#bebfff'};
  SVG.getElementById('bg_rect').style.fill = color;
  if (card.classList.contains('hl')) { SVG.getElementById('border').style.fill = '#FF0000' };
};
function custom_cards() {
  var cards = document.getElementsByClassName('card');
  for (var i=0; i<cards.length; i++) custom_card(cards[i]);
};
function card_grey(action) {
  if (action) { this.attr({fill: '#000000'}) }
  else { this.attr({fill: '#000000'})  };
};
function on_load() {
  custom_cards();
  document.getElementById('coinC').getSVGDocument().getElementById('value').textContent = 0;
  document.getElementById('coinP').getSVGDocument().getElementById('value').textContent = 11;
  var SVG = document.getElementById('card-n!').getSVGDocument();
  SVG.getElementById('empty_bg').addEventListener('mouseover', function(){this.style.opacity=0.13;}, false);
  SVG.getElementById('empty_bg').addEventListener('mouseout', function(){this.style.opacity=0;}, false);
  SVG.addEventListener('click', game_join, false);
  var SVG2 = document.getElementById('coinP').getSVGDocument();
  SVG2.addEventListener('click', game_pass, false);
  var SVG3 = document.getElementById('coinC').getSVGDocument();
  SVG3.addEventListener('click', game_pick, false);
  document.getElementById('nextplayer').textContent = "click to join"
};
function create_card(num) {
  var card = document.createElement("object");
  card.className = "card";
  card.style.zIndex = 38-num;
  card.id = "card-"+num;
  card.type = "image/svg+xml";
  card.data = "/static/card.svg";
  //card.onload = card.onreadystatechange = custom_card(card);
  return card
};
function cardzone(player, cards) {
  var zone = document.getElementById("cardzone-p"+player);
  while (zone.childNodes.length > 0) zone.removeChild(zone.firstChild);
  for (var i=0; i<cards.length; i++) {
    var group = document.createElement("div");
    group.className = "cardgroup";
    for (var j=0; j<cards[i].length; j++) {
      var card = create_card(cards[i][j]);
      card.onload = function(ev) { custom_card(ev.target); };
      group.appendChild(card);
    };
    zone.appendChild(group);
  };
  //setTimeout(custom_cards, 200);
};
function update_cardup(num) {
  var card = document.getElementsByClassName('card-up')[0]
  card.id = 'card-'+num;
  custom_card(card);
};
function update_hand(player, num) {
  var zone = document.getElementById('cardzone-p'+player);
  var card = create_card(num);
  card.className += " card-pop"
  setTimeout('document.getElementById("card-'+num+'").classList.remove("card-pop")', 2000)
  card.onload = function(ev) { custom_card(ev.target); };
  cplus  = document.getElementById('card-'+(num+1))
  cminus = document.getElementById('card-'+(num-1))
  if (zone.contains(cplus)) {
    cplus.parentNode.insertBefore(card, cplus);
    if (zone.contains(cminus)) {
      mergediv(cminus.parentNode, cplus.parentNode);
    };
  } else if (zone.contains(cminus)) {
    cminus.parentNode.appendChild(card);
  } else {
    var group = document.createElement("div");
    group.className = "cardgroup";
    group.appendChild(card);
    for (var i=num+2; i < 35+1; i++) {
        var cnext = document.getElementById('card-'+i)
        if (zone.contains(cnext)) {
            zone.insertBefore(group, cnext.parentNode)
            break;
        };
    };
    if (!group.parentNode) {
      zone.appendChild(group);
    };
  };
  //setTimeout(custom_cards, 200);
  //setTimeout(custom_cards, 500);
};
function update_coins(id, coins) {
  var coin = document.getElementById(id)
  if (coins == 0) {
    coin.classList.add('hidden')
  } else {
    coin.classList.remove('hidden')
  };
  coin.getSVGDocument().getElementById('value').textContent = coins;
};
function update_players(players, hideempty) {
  var p = {}; var n = 1;
  for (var i=0; i<players.length; i++) {
    if (players[i][0] == $('#uuid').data('uuid')) {
      var n = 0;
      p[players[i][0]] = {'num':0,   'name':players[i][1]};
      update_player_name(0, players[i][1]);
      update_player_score(0, 'prêt');
    } else {
      p[players[i][0]] = {'num':i+n, 'name':players[i][1]};
      update_player_name(i+n, players[i][1]);
      update_player_score(i+n, 'prêt');
    };
  };
  if(!(typeof(hideempty)=='undefined') && hideempty) {
    for (var i=players.length; i<5+1; ++i) {
      document.getElementById('player'+i).classList.add('nodisplay')
    };
  };
  $('#uuid').data('players', p);
};
function update_player_name(num, name) {
  document.getElementById('p'+num+'-name').textContent = name;
};
function update_player_score(num, score) {
  document.getElementById('p'+num+'-score').textContent = score;
};
function mergediv(div1, div2) {
    //div1.innerHTML = div1.innerHTML + div2.innerHTML;
    while (div2.children.length>0) div1.appendChild(div2.children[0]);
    div2.parentNode.removeChild(div2);
};
function toggleNickinputForm() {
    if (document.getElementById('nickinput').classList.contains('nodisplay')) {
        document.getElementById('nickinput').classList.remove('nodisplay');
        document.getElementById('p0-name-p').classList.add('nodisplay');
    } else {
        document.getElementById('nickinput').classList.add('nodisplay');
        document.getElementById('p0-name-p').classList.remove('nodisplay');
    };
};
function game_reset(notif) {

    if (typeof(notif) != 'undefined') {
      var noty_game_stop = noty({
        text: 'Game is over!',
        layout: 'center',
        buttons: [
          {addClass: 'btn btn-primary', text: 'Yes', onClick: function($noty) {
              game_reset();
              $noty.close();
              }
          },
        ]
      });
    } else {
      // reset players zones
      var pz = document.getElementsByClassName('player')
      for (i=0; i<pz.length; i++) {pz[i].classList.remove('nodisplay');};
      // remove player hands
      var cg = document.getElementsByClassName('cardgroup');
      while (cg.length>0) {cg[0].remove();};
      // reset deck and coins
      update_cardup('n!');
      var cardup = document.getElementById('card-n!');
      var SVG = document.getElementById('card-n!').getSVGDocument();
      SVG.addEventListener('click', game_join, false);

      update_coins('coinC', 0);
      update_coins('coinP', 0);
      var ns = document.getElementsByClassName('nick');
      var ss = document.getElementsByClassName('score');
      for (var i=0; i<ns.length; i++) {
          ns[i].textContent = '';
          ss[i].textContent = 'ne joue pas';
      };
      // reset player name (from form)
      document.getElementById('p0-name').textContent = document.getElementById('nickdata').value
    };
};
function game_stop() {
    var noty_game_stop = noty({
      text: 'Are you sure you want to stop the game? This will affect all the players!',
      modal: true,
      layout: 'center',
      buttons: [
        {addClass: 'btn btn-primary', text: 'Yes', onClick: function($noty) {
            document.socket_game.emit('stop', {'confirm': true});
            $noty.close();
              }
        },
        {addClass: 'btn btn-danger', text: 'Cancel', onClick: function($noty) {
            $noty.close();
          }
        }
      ]
    });
};
function game_start() {
    var noty_game_stop = noty({
      text: 'Start the game?',
      modal: true,
      layout: 'center',
      buttons: [
        {addClass: 'btn btn-primary', text: 'Yes', onClick: function($noty) {
            document.socket_game.emit('start');
            $noty.close();
              }
        },
        {addClass: 'btn btn-danger', text: 'Cancel', onClick: function($noty) {
            $noty.close();
          }
        }
      ]
    });
};
function game_join() {
    var noty_game_stop = noty({
      text: 'Join the game?',
      modal: true,
      layout: 'center',
      buttons: [
        {addClass: 'btn btn-primary', text: 'Yes', onClick: function($noty) {
            document.socket_game.emit('play');
            var SVG = document.getElementById('card-n!').getSVGDocument();
            SVG.removeEventListener('click', game_join, false)
            SVG.addEventListener('click', game_start, false);
            document.getElementById('nextplayer').textContent = "click to start"
            $noty.close();
              }
        },
        {addClass: 'btn btn-danger', text: 'Cancel', onClick: function($noty) {
            $noty.close();
          }
        }
      ]
    });
};
function game_pick() {
    document.socket_game.emit('action', {'data': 'pick'});
};
function game_pass() {
    document.socket_game.emit('action', {'data': 'pass'});
};
function rules() {
    r = "<h1>Rules</h1>\
    <p>There are <em>33</em> cards from <em>3</em> to <em>35</em> in the deck.\
    Nobody wants them as they are negatives points.\
    At your turn, you can choose to pay 1 coin and leave the card or take it…\
    and the negative points.</p>\
    <p>Luckily, if you choose to pick the card you also get the coins that\
    everyone payed so far to refuse the card. Also, if several of your cards\
    form a run (e.g., 25/25/26), only the smallest one counts!</p>\
    <p>When the game ends, the player with the least points wins.</p>\
    <h2>Moar rulz</h2>\
    <ul><li><em>9</em> random cards are missing to avoid long runs.</li>\
    <li>If you pick a card, this is still your turn to play.</li>\
    <li>If you have no coins, <em>you shall not pass!</em> Take the card.</li>\
    <li>The coins you don't use are bonus points!\
    <em>-1 point</em> for each of them.</li></ul>\
    <h2>Tips</h2>\
    <ul><li>Be patient, let other people pay for this card they don't want!</li>\
    <li>Be safe, don't waste all your coins,\
    you'll have to take a card sometime anyway…</li></ul>"

    var popup_rules = noty({'layout': 'bottom', 'text': r});
};
window.onload = on_load;

