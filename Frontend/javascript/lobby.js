const lobbyScreen = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "game" });
    },

    preload: function() {
        // this.load.image('bg', 'assets/bg.png');

    },

    create: function() {
        // let bg = this.add.image(0, 0, 'bg');
        //
        // bg.displayHeight=game.config.height;
        // bg.scaleX=bg.scaleY;
        //
        // bg.y=game.config.height/2;
        // bg.x=game.config.width/2;

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        const startGame = this.add.text(screenCenterX, screenCenterY, 'Start The game', style).setOrigin(0.5);
    },

    update: function() {}
});