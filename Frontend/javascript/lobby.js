var timer;
var timedEvent;
var playerName;
var rectangle;
var p1Score = 0;
var container;
var currentTime;
var winnerDeclared = false;

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
            // container.add(this.add.circle(localX-container.width/2, localY-container.height/2, 5, paint_color));
            p1Score += 1;
            playerName.setText(username + ": " + p1Score);

            // Send fire shot event to server
            room_obj.send("shot", { x: localX, y: localY});
        });

        this.physics.add.existing(container);

        container.body.velocity.x = 100;
        container.body.velocity.y = 100;
        container.body.bounce.x = 1;
        container.body.bounce.y = 1;
        container.body.collideWorldBounds = true;

        // TIMER
        timer = this.add.text(5, 5, getCountDown());
        // timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

        //PLAYERS NAME
        playerName = this.add.text(5, 25, username + ": " + p1Score);

    },

    update: function() {

        if(gameTime && currentTime != gameTime) {
            currentTime = gameTime;
            timer.setText(getCountDown());
        }

        if(updateQueue.length != 0){
            const {player, key} = updateQueue.pop();
            const [pointX, pointY] = key.split(',');
            const shotColor = Phaser.Display.Color.HexStringToColor(colorMap[player]).color;
            container.add(this.add.circle(pointX-container.width/2, pointY-container.height/2, 5, shotColor));
        }

        if(isGameOver && !winnerDeclared){
            onGameOver();
        }
    }
});

// GET COUNTDOWN
function getCountDown(){
    const time = currentTime ? formatTime(currentTime) : '0:00';
    return 'Countdown: ' + time;
}

//TIMER FORMAT
function formatTime(seconds)
{
    var minutes = Math.floor(seconds/60);
    var partInSeconds = seconds%60;
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    return `${minutes}:${partInSeconds}`;
}

//TIMER COUNTDOWN
function onGameOver(){
    timer.setText('Countdown: 0:00');
    winnerDeclared = true;
    alert(getWinner()+" Won the game");
}

// GET WINNER
function getWinner(){
    let highest = -1;
    let winner = '';
    
    for(const property in scores) {
        alert(property + "=" + scores[property]);
        if(scores[property] > highest) {
            highest = scores[property];
            winner = property;
        }
    }
    return winner;
}

// function onEvent ()
// {
//     this.initialTime -= 1; // One second
//     timer.setText('Countdown: ' + formatTime(this.initialTime));
//     if(this.initialTime==0){
//         alert(username+" Won the game");
//         // rectangle.disableInteractive();
//     }
// }