import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";
import { Schema, MapSchema, type } from "@colyseus/schema";

var colorCodes:string[]; 
colorCodes = ["#191970","#006400","#ff0000","#ffd700","#00ff00","#00ffff","#ff00ff","#ffb6c1"]
export class MyRoom extends Room<MyRoomState> {

  
  onCreate (options: any) {
    // console.log("room created")
    this.setState(new MyRoomState());
    // this.state.canvas.push("1")
    // this.state.canvas.push("2")

    this.state.canvas.set ( "10,10", "Client_1" );

    this.onMessage("move", (client, message) => {
      //console.log("received message")
      //console.log(message)
      //console.log(this)
      //
      // handle "type" message
      //
    });

    this.onMessage("shoot", (client, message) => {
      //console.log("player", client.sessionId, " took a shot", message)
    });

    this.onMessage("shot", (client, message) => {
      //console.log("player", client.sessionId, " took a shot", message)
      if(this.state.isRunning == true){
        var key = message.x + "," + message.y;
        this.state.canvas.set ( key, client.sessionId );
        this.broadcast("canvas-updated", {state: this.state.canvas});
      }
    });

    this.onMessage("startGame", (client, message) => {
      console.log("Starting time " + this.clock.currentTime);
      console.log("Running Flag= "+this.state.isRunning);
      if (this.state.isRunning == false) {
        this.state.canvas = new MapSchema();
        this.state.isRunning = true;
        this.broadcast("game_started", {state: this.state.canvas});
        this.clock.start();
        this.clock.setTimeout(() => { console.log("Time now " + this.clock.currentTime);
        this.broadcast("Game is over",this.state.canvas);
        this.state.isRunning = false;
        this.clock.stop();
      }, 15_000);
      }
    });
  }

  onJoin (client: Client, options: any) {
    if(this.state.isRunning == false){
    console.log(client.sessionId, "joined!");
    // client.send("joinMessage", {time: 60})
    //call this.State.Incr()
    this.state.colorMap.set(client.sessionId, colorCodes[this.state.playerCount]);
    this.state.playerCount += 1;
    this.broadcast ( "joinMessage", { player: client.sessionId, time:60, canvascheck: this.state.canvas, colorMap: this.state.colorMap } );
    this.broadcastPatch();
    }
  }

  onLeave (client: Client, consented: boolean) {
    this.state.colorMap.delete(client.sessionId);
    this.broadcast("leaveMessage",{colorMap: this.state.colorMap});
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }



}
