import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  onCreate (options: any) {
    // console.log("room created")
    this.setState(new MyRoomState());
    this.state.canvas.push("1")
    this.state.canvas.push("2")
    this.onMessage("move", (client, message) => {
      console.log("received message")
      console.log(message)
      console.log(this)
      //
      // handle "type" message
      //
    });

    this.onMessage("shoot", (client, message) => {
      console.log("player", client.sessionId, " took a shot", message)
    });

  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    // client.send("joinMessage", {time: 60})
    //call this.State.Incr()
    this.state.playerCount += 1
    this.broadcast("joinMessage", {player: client.sessionId, time:60, count: this.state.playerCount, canvascheck: this.state.canvas[1]});
    this.broadcastPatch();
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
