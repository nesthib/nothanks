$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
    var socket_game = io.connect('http://' + document.domain + ':' + location.port + '/game');
    socket.on('notif', function(data) {
        notification = {text: data.message,
                        layout: data.layout,
                        timeout: data.timeout,
                        type: data.type,
                       };
        var n = noty(notification);
    });
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
    socket_game.on('gamestart', function(msg) {
        var SVG = document.getElementById('card-n!').getSVGDocument();
        SVG.removeEventListener('click', game_join, false)
        SVG.removeEventListener('click', game_start, false)
        SVG.addEventListener('click', game_pick, false);
        update_players(msg.players, true);
        document.getElementById('game-stop-div').classList.remove('hidden');
        document.getElementById('coinP').classList.remove('hidden')
    });
    socket_game.on('gameplayers', function(msg) {
        update_players(msg.players);
        //var players = {}; var n = 1;
        //for (var i=0; i<msg.players.length; i++) {
          //if (msg.players[i][0] == $('#uuid').data('uuid')) {
            //var n = 0;
            //players[msg.players[i][0]] = {'num':0,   'name':msg.players[i][1]};
            //update_player_name(0, msg.players[i][1]);
            //update_player_score(0, 'prêt');
          //} else {
            //players[msg.players[i][0]] = {'num':i+n, 'name':msg.players[i][1]};
            //update_player_name(i+n, msg.players[i][1]);
            //update_player_score(i+n, 'prêt');
          //};
        //};
        //$('#uuid').data('players', players);
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
        //var name = $('#uuid').data('players')[msg.player]['name'];
        var name = msg.player;
        document.getElementById('nextplayer').textContent = name;
        var my_name = $('#uuid').data('players')[$('#uuid').data('uuid')]['name']
        if (name == my_name) noty({text: 'This is your turn '+name, layout: 'topRight', timeout: 3000, type:'information'}) ;
    });
    socket_game.on('winner', function(msg) {
        var noty_game_stop = noty({
          text: msg.text,
          type: (msg.success) ? 'success' : 'error',
          modal: true,
          layout: 'center',
          buttons: [
            {addClass: 'btn btn-primary', text: 'Reset', onClick: function($noty) {
                game_reset();
                $noty.close();
                  }
            },
          ]
        });
    });
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
    document.socket_chat = socket
    document.socket_game = socket_game
});
