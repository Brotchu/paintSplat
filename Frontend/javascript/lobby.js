var timer;
var timedEvent;
var playerName;
var rectangle;
var yourScore = 0;
var container;
var currentTime;
var winnerDeclared = false;
var speed = 100;

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

        this.physics.add.existing(container);

        container.body.velocity.x = speed;
        container.body.velocity.y = speed;
        container.body.bounce.x = 1;
        container.body.bounce.y = 1;
        container.body.collideWorldBounds = true;

        container.on('pointerdown', (_, localX, localY) => {
            yourScore += 1;
            playerName.setText("Your Score: " + yourScore);

            // Send fire shot event to server
            room_obj.send("shot", { x: localX, y: localY});
        });
        
        // TIMER
        timer = this.add.text(5, 5, getCountDown());

        //PLAYERS NAME
        playerName = this.add.text(5, 25, username + ": " + yourScore);

    },

    update: function() {

        if(gameTime && currentTime != gameTime) {
            currentTime = gameTime;
            timer.setText(getCountDown());

            if(currentTime % 60 == 0){
                speed += 100;
                container.body.velocity.x = speed;
                container.body.velocity.y = speed;
                console.log('speed:'+speed);
            }
        }

        if(updateQueue.length != 0){
            const {player, key} = updateQueue.pop();
            const [pointX, pointY] = key.split(',');
            const shotColor = Phaser.Display.Color.HexStringToColor(colorMap[player]).color;
            container.add(this.add.circle(pointX-container.width/2, pointY-container.height/2, 5, shotColor));
        }

        if(isGameOver && !winnerDeclared && scores){
            timer.setText('Countdown: 0:00');
            winnerDeclared = true;
            container.destroy();
            timer.destroy();
            playerName.destroy();

            let highest = -1;
            let winner = '';
            let lineHeight = 50;

            this.add.text(10, 5, "**** ScoreBoard *****");

            for(const player in scores) {
                this.add.text(5, lineHeight, names[player] + " = " + scores[player]);
                if(scores[player] > highest) {
                    highest = scores[player];
                    winner = player;
                }
                lineHeight += 20;
            }

            this.add.text(5, lineHeight + 30, names[winner] + " has won the game!" );
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