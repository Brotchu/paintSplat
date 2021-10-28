var timer;
var timedEvent;
var playerName;
var rectangle;
var p1Score = 0;
var container;

const lobbyScreen = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "game" });
    },

    preload: function() {

    },

    create: function() {
        container = this.add.container(0, 0);
        container.setSize(game.config.width*.3, game.config.height*.3).setInteractive();
        container.add(this.add.rectangle(0, 0, container.width, container.height, 0xFFFFFF));
        container.on('pointerdown', (_, localX, localY) => {
            container.add(this.add.circle(localX-container.width/2, localY-container.height/2, 5, paint_color));
            p1Score += 1;
            playerName.setText(username + ": " + p1Score);

            // Send fire shot event to server
            room_obj.send("shot", { x: localX, y: localY});
        });


        // // rectangle = this.add.rectangle(0, 0, game.config.width*.3, game.config.height*.3, 0xFFFFFF).setInteractive(new Phaser.Geom.Rectangle(0, 0, 300, 200), Phaser.Geom.Rectangle.Contains);
        // rectangle = this.add.rectangle(0, 0, game.config.width*.3, game.config.height*.3, 0xFFFFFF).setInteractive();

        this.physics.add.existing(container);

        container.body.velocity.x = 100;
        container.body.velocity.y = 100;
        container.body.bounce.x = 1;
        container.body.bounce.y = 1;
        container.body.collideWorldBounds = true;

        //THROW
        // container.on('pointerdown', function (pointer, localX, localY) {
        //     p1Score += 1;
        //     playerName.setText(username + ": " + p1Score);
        //
        //     var touchX = pointer.x;
        //     var touchY = pointer.y;
        //     // console.log(touchX+" "+touchY)
        //     console.log(localX+" "+localY);
        // });

        // TIME IN SECOND
        this.initialTime = 50;
        timer = this.add.text(5, 5, 'Countdown: ' + formatTime(this.initialTime));
        timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

        //PLAYERS NAME
        playerName = this.add.text(5, 25, username + ": " + p1Score);

    },

    update: function() {}
});

var username = 'test';
// var username = prompt('Enter your name:');


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
        // rectangle.disableInteractive();
    }
}