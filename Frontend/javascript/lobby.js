var timer;
var timedEvent;
var playerName;
var rectangle;
var p1Score = 0;

const lobbyScreen = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "game" });
    },

    preload: function() {

    },

    create: function() {
        rectangle = this.add.rectangle(0, 0, game.config.width*.3, game.config.height*.3, 0xFFFFFF).setInteractive();

        this.physics.add.existing(rectangle);

        rectangle.body.velocity.x = 100;
        rectangle.body.velocity.y = 100;
        rectangle.body.bounce.x = 1;
        rectangle.body.bounce.y = 1;
        rectangle.body.collideWorldBounds = true;

        //THROW
        rectangle.on('pointerdown', function (pointer) {
            // this.setTint(0xff0000);
            console.log('pointerover');
            p1Score += 1;
            playerName.setText(username + ": " + p1Score);
        });

        // TIME IN SECOND
        this.initialTime = 5;
        timer = this.add.text(5, 5, 'Countdown: ' + formatTime(this.initialTime));
        timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

        //PLAYERS NAME
        playerName = this.add.text(5, 25, username + ": " + p1Score);

    },

    update: function() {}
});

var username = prompt('Enter your name:');


//TIMER FORMAT
function formatTime(seconds)
{
    var minutes = Math.floor(seconds/60);
    var partInSeconds = seconds%60;
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    return `${minutes}:${partInSeconds}`;
}

//TIMER COUNTDOWN
function onEvent ()
{
    this.initialTime -= 1; // One second
    timer.setText('Countdown: ' + formatTime(this.initialTime));
    if(this.initialTime==0){
        alert(username+" Won the game");
    }
}