var game = $('.game')
var adjustSize = function() {
    var width = game.width()/10
	game.css('height', game.width()/10)
	game.css('font-size',  width/3.5 + 'px')
}
adjustSize()
$(window).resize(adjustSize)

