import { Room, Client, Delayed } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";
import { Schema, MapSchema, type } from "@colyseus/schema";

var colorCodes:string[]; 
var gameTime = 15_000;
colorCodes = ["#191970","#006400","#ff0000","#ffd700","#00ff00","#00ffff","#ff00ff","#ffb6c1"]
export class MyRoom extends Room<MyRoomState> {
public delayedInterval!: Delayed;
  
  onCreate (options: any) {

    // console.log("room created")
    this.setState(new MyRoomState());

    this.onMessage("shot", (client, message) => {
      if(this.state.isRunning == true) {
        var x = Math.round(message.x / 5.0) * 5;
        var y = Math.round(message.y / 5.0) * 5;
        var key = x + "," + y;
        
        if ( this.state.canvas.get(key) == undefined ) {
          this.state.canvas.set ( key, client.sessionId );
          this.broadcast("canvas-updated", {client_id: client.sessionId, key: key});
        }
        else {
          console.log("This coordinate is already shot.");
          client.send("overlap", "This coordinate is already shot.");
        }
      }
    });

    this.onMessage("startGame", (client, message) => {

      // Return if a game is already running.
      if ( this.state.isRunning == true ) {
        client.send("game_running", "A game's already running.");
        return;
      }
      
      console.log ( "Starting time: " + this.clock.currentTime );

      if (this.state.isRunning == false) {

        this.state.canvas = new MapSchema();
        this.state.isRunning = true;
        this.broadcast("game_started", {state: this.state.canvas});
        this.clock.start();
        var countdownTime = (gameTime/1_000) - Number( (this.clock.elapsedTime/1_000).toFixed(0) );
        this.broadcast ( "Game Timer", countdownTime );    
        
        this.delayedInterval = this.clock.setInterval(() => {
          var countdownTime = (gameTime/1_000) - Number( (this.clock.elapsedTime/1_000).toFixed(0) );
          this.broadcast ( "Game Timer", countdownTime );
        }, 1_000);
        
        this.clock.setTimeout ( () => { 
          
          console.log("Time at end of game " + this.clock.elapsedTime);
          var scores = {};
          // this.state.canvas.forEach((value, key) => {
          //   if (scores.get(value) == undefined) {
          //     scores.set(value, 1)
          //   } else {
          //     scores.set(value, scores.get(value) + 1 )
          //   }
          // });
          for (let [key, value] of this.state.canvas.entries()){            
            if (value in scores){
              var count = scores[value];
              // scores.set(value, count+1)
              scores[value] = count+1
            } else {
              scores[value]= 1;
            }
          }
          // this.broadcast("Game is over",this.state.canvas);
          this.broadcast("Game is over", scores)
          this.state.isRunning = false;
          this.delayedInterval.clear();
          this.clock.stop();

        }, gameTime );
      }
    });
  }

  onJoin (client: Client, options: any) {
    if(this.state.isRunning == false){
      console.log(client.sessionId, "joined!", options);
      // client.send("joinMessage", {time: 60})
      //call this.State.Incr()
      this.state.playerName.set(client.sessionId, options.name)
      this.state.colorMap.set(client.sessionId, colorCodes[this.state.playerCount]);
      this.state.playerCount += 1;
      this.broadcast ( "joinMessage", { player: client.sessionId, time:60, canvascheck: this.state.canvas, colorMap: this.state.colorMap, names: this.state.playerName } );
      this.broadcastPatch();
    }
  }

  onLeave (client: Client, consented: boolean) {
    this.state.colorMap.delete(client.sessionId);
    this.state.playerName.delete(client.sessionId);
    this.broadcast("leaveMessage",{colorMap: this.state.colorMap, names: this.state.playerName});
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }



}
