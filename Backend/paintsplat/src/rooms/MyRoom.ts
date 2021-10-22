import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  onCreate (options: any) {
    // console.log("room created")
    this.setState(new MyRoomState());
    // this.state.canvas.push("1")
    // this.state.canvas.push("2")

    this.state.canvas.set ( "10,10", "Client_1" );

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

    this.onMessage("shot", (client, message) => {
      console.log("player", client.sessionId, " took a shot", message)
      var key = message.x + "," + message.y;
      this.state.canvas.set ( key, client.sessionId );
      this.broadcast("canvas-updated", {state: this.state.canvas});
    });

  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    // client.send("joinMessage", {time: 60})
    //call this.State.Incr()
    // this.state.playerCount += 1
    this.broadcast ( "joinMessage", { player: client.sessionId, time:60, canvascheck: this.state.canvas } );
    this.broadcastPatch();
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
