$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
    socket.on('chatoutput', function(msg) {
        $('#chatarea').val($('#chatarea').val() + msg.data + '\n');
        $('#chatarea').scrollTop($('#chatarea')[0].scrollHeight);
    });
    socket.on('nickoutput', function(msg) {
        $('#nickdata').val(msg.data);
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
});
