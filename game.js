Game = {
    drawEventFuncs: [],
    updateEventFuncs: [],
    gameCanvas: null,
    gameCtx: null,
    
    init: function() {
        var _self = Game;
        
        _self.gameCanvas = document.getElementById("game-canvas");
        _self.gameCtx = _self.gameCanvas.getContext("2d");
        
        _self.player.init();
    },
    
    run: function() {
        var _self = Game;
        
        _self.infrastructure.startGameLoop();
    },
    
    player: {
        texture: null,
        posX: 0,
        posY: 0,
        
        init: function() {
            var _self = Game.player;
            
            _self.texture = document.getElementById("player-ship");
            
            Game.drawEventFuncs.push(_self.draw);
        },
        
        draw: function() {
            var _self = Game.player;
            
            Game.gameCtx.drawImage(_self.texture, _self.posX, _self.posY, 200, 300);
        }
    },

    infrastructure: {
        // This object will hold the game's interval in case the game will be run via setInterval
        gameInterval: null,
        // This object will hold the current animation frame request if the game will be run via window.requestAnimationFrame
        gameAnimationRequest: null,
        gameFPS: 30,
        
        // A function that runs in each frame of the game. This function handles the logic of calling all the events
        // the game should call in each frame, in order to simulate the game's animation.
        gameFrame: function() {            
            // Trigger update event
            for (i = 0; i < Game.updateEventFuncs.length; i++) {
                Game.updateEventFuncs[i]();
            }
            
            // Clear the game canvas
            Game.gameCtx.clearRect(0, 0, Game.gameCanvas.width, Game.gameCanvas.height);
            
            // Trigger draw event
            for (i = 0; i < Game.drawEventFuncs.length; i++) {
                Game.drawEventFuncs[i]();
            }   
        },
        
        startGameLoop: function() {
            var _self = Game.infrastructure
            
            if (window.requestAnimationFrame) {
                var _gameFrame = function() {
                    _self.gameAnimationRequest = window.requestAnimationFrame(_gameFrame);
                    
                    _self.gameFrame();
                }
                
                _self.gameAnimationRequest = window.requestAnimationFrame(_gameFrame);
            // If the current browser does not support any type of requestAnimationFrame - just run with a stupid interval.
            } else {
                var intervalTime = 1000 / _self.gameFPS;

                _self.gameInterval = setInterval(_self.gameFrame, intervalTime)
            }
        },
        
        stopGameLoop: function() {
            var _self = Game.infrastructure;
            
            if (_self.gameInterval) {
                clearInterval(_self.gameInterval);
            }
            
            if (_self.gameAnimationRequest) {
                window.cancelAnimationFrame(_self.gameAnimationRequest);
            }
        }
    }
};

Game.init();
Game.run();