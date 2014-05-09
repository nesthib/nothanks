$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
    var socket_game = io.connect('http://' + document.domain + ':' + location.port + '/game');
    socket.on('chatoutput', function(msg) {
        $('#textarea').val($('#textarea').val() + msg.data + '\n');
        $('#textarea').scrollTop($('#textarea')[0].scrollHeight);
    });
    socket.on('uuid', function(msg) {
//        $('#uuid').data('uuid', msg.uuid);
        $('#uuid').attr('data-uuid', msg.uuid);
    });
    socket.on('nickoutput', function(msg) {
        $('#nickdata').val(msg.data);
        $('#p0-name').text(msg.data)
    });
    socket.on('nicklistupdate', function(msg) {
        $('#nicklist').val(msg.data);
    });
    $('form#chatinput').submit(function(event) {
        socket.emit('chatinput', {data: $('#chatdata').val()});
        $('#chatdata').val('');
        return false;
    });
    $('form#nickinput').submit(function(event) {
        socket.emit('nickinput', {data: $('#nickdata').val()});
        return false;
    });
    socket_game.on('gameplayers', function(msg) {
        var players = {}; var n = 1;
        for (var i=0; i<msg.players.length; i++) {
          if (msg.players[i][0] == $('#uuid').data('uuid')) {
            var n = 0;
            players[msg.players[i][0]] = {'num':0,   'name':msg.players[i][1]};
            update_player_name(0, msg.players[i][1]);
          } else {
            players[msg.players[i][0]] = {'num':i+n, 'name':msg.players[i][1]};
            update_player_name(i+n, msg.players[i][1]);
          };
        };
        $('#uuid').data('players', players);
    });
    socket_game.on('gameoutput', function(msg) {
      //  $('#textarea').val($('#textarea').val() + msg.text + '\n');
        $('#textarea').val(msg.text);
        $('#textarea').scrollTop($('#textarea')[0].scrollHeight);
    });
    socket_game.on('cardup', function(msg) {
        update_cardup(msg.card);
    });
    socket_game.on('coinstatus', function(msg) {
         update_coins('coinP', msg.players[$('#uuid').data('uuid')]);
         update_coins('coinC', msg.game);
    });
    socket_game.on('scores', function(msg) {
        for (uuid in msg.scores) {
            num = $('#uuid').data('players')[uuid]['num'];
            score = msg.scores[uuid];
            document.getElementById('p'+num+'-score').textContent = score+' points';
        };
    });
    socket_game.on('cardpick', function(msg) {
        player = $('#uuid').data('players')[msg.player]['num'];
        update_hand(player, msg.card);
    });
    socket_game.on('cards_update', function(msg) {
        $('#uuid').data('hands', msg.hands);
        for (uuid in msg.hands) {
            player = $('#uuid').data('players')[uuid]['num'];
            var hand = msg.hands[uuid];
            cardzone(player, hand);
        };
    });
    socket_game.on('nextplayer', function(msg) {
        var name = $('#uuid').data('players')[msg.player]['name'];
        document.getElementById('nextplayer').textContent = name;
    });
    socket_game.on('gamewinner', function(msg) {
        var winner = $('#uuid').data('players')[uuid]['name']
        alert('Le gagnant est '+winner);
    });
//    socket_game.on('cards_update_old', function(msg) {
//        $('#textarea').val($('#textarea').val() + '\n[' + msg.cardnum + ']' + '\n');
//        var blabla = msg.cardnum;
//        update_hand(0, msg.cardnum);
//    });
    socket_game.on('gameinfo', function(msg) {
        $('#card').text(msg.card);
        $('#bonus').text(msg.bonus);
        $('#nextplayer').text(msg.nextplayer);
    });
    socket_game.on('gameinfo_private', function(msg) {
        $('#score').text(msg.score);
        $('#coins').text(msg.coins);
        $('#cards').text(JSON.stringify(msg.cards));
    });
    $('form#play').submit(function(event) {
        socket_game.emit('play');
        return false;
    });
    $('form#start').submit(function(event) {
        socket_game.emit('start');
        return false;
    });
    $('form#stop').submit(function(event) {
        socket_game.emit('stop');
        return false;
    });
    $('form#pick').submit(function(event) {
        socket_game.emit('action', {data: 'pick'});
        return false;
    });
    $('form#pass').submit(function(event) {
        socket_game.emit('action', {data: 'pass'});
        return false;
    });
    $('form#debug').submit(function(event) {
        socket_game.emit('debug');
        return false;
    });
});
