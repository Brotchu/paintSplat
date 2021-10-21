import { Schema, Context, type, ArraySchema } from "@colyseus/schema";

export class MyRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";
  @type("number") playerCount: number = 0;

  @type(["string"]) canvas = new ArraySchema<string>();

  
  //10*10 canvas [] 100 elements
  //2d array : canvas [][]{ clientid }
}


// canvas[][] clientid
// [0][0] -> "abc" -> client hit this spot

// import { Schema, ArraySchema, type } from "@colyseus/schema";

// class Block extends Schema {
//     @type("number") x: number;
//     @type("number") y: number;
// }i = x + width*y;

// class MyState extends Schema {
//     @type([ Block ]) blocks = new ArraySchema<Block>();
// }

//this.state

// <10,10> [10][10]<clientid>
  // <x,y> [x][y] -> 
  // map <clientid>count <-- update on shot




//add 1 to playerCount , when client joins
//MyRoomState.Incr() => playerCount += 1