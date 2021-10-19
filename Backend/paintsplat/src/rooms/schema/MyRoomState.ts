import { Schema, Context, type } from "@colyseus/schema";

export class MyRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";
  @type("number") playerCount: number = 0;

  //2d array : canvas [][]{ clientid }
}

//this.state

// <10,10> [10][10]<clientid>
  // <x,y> [x][y] -> 
  // map <clientid>count <-- update on shot




//add 1 to playerCount , when client joins
//MyRoomState.Incr() => playerCount += 1