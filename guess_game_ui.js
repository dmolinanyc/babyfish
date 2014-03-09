define(["jquery"], function($) {
	$(function() {
		var gamesocket = new WebSocket("ws://ec2-54-80-138-162.compute-1.amazonaws.com:8080");
		gamesocket.onopen = function(evt) { console.log('open'); };
		gamesocket.onclose = function(evt) {  console.log('close'); };
		gamesocket.onerror = function(evt) { console.log("error"); };
		gamesocket.onmessage = function(evt) {
			var guesses = JSON.parse(evt.data).guesses;			
			$('#guess_game').empty();
			if ( JSON.parse(evt.data)['correct'] || JSON.parse(evt.data)['incorrect']  ) {
				if (  JSON.parse(evt.data)['correct'] ) {
					$('#guess_game').html("You guessed " + guesses[guesses.length-1] + " correctly in " + guesses.length + " attempts");
				} else {
					$('#guess_game').html("You are a terrible guesser the correct answer was " + JSON.parse(evt.data)['incorrect']);					
				}
				$('#guess_game').append("<form><button>Try Again</button></form>");
			} else { 
				$('#guess_game').html("I am thinking of a number between 1-20, care to guess?");
				if ( guesses.length < 5 ) {
					$('#guess_game').append("<form id=guess><input type=text size=2></form>")
					$('#guess').append('(' + (5-guesses.length) + ' guesses left)');
					if ( guesses.length ) {
						$('#guess').append('<br>Guesses so far: ' + guesses.toString() );
					}											
					$('#guess').submit(function (e) {
						e.preventDefault();
						if ( $(e.target).children('input, button').val() ) {
							gamesocket.send($(e.target).children('input, button').val());
						}
					});
				}
			} 			
		}			
	});							
});