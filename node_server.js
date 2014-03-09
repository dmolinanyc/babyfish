var requirejs = require('requirejs'),	
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 8080});

requirejs.config({
    nodeRequire: require
});

wss.on('connection', function(ws) {

	ws.disconnect = function() {console.log('disconnect')}
    
	ws.on('message', function(message) {
		var g = message;
		ws.guesses.push(g);		
		if ( parseInt(g) == ws.randomnumber ) {
			console.log('correct');
			ws.send(JSON.stringify({guesses:ws.guesses, correct: true}));
		} else if ( ws.guesses.length > 4 )  {		
			console.log('over');
			ws.send(JSON.stringify({incorrect: ws.randomnumber}));
		} else {
			console.log('incorrect');
			ws.send(JSON.stringify({guesses:ws.guesses}));
		}
    	    	
	});
    
    ws.on('close', function() {
        console.log('close');
    });
    
    ws.randomnumber = Math.floor((Math.random()*20)+1);
    ws.guesses = new Array();
    ws.send(JSON.stringify({guesses:ws.guesses}));
    
});

console.log('started server');