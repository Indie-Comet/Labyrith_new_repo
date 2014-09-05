#pragma strict

//Ловушка if trap.life == -1 trap is endless// if trap.life == 0 trap is empty
class Trap extends LabyrinthObject {
	static public var TRAP_TYPE_EMPTY = 0;
	static public var TRAP_TYPE_LAND_MINE = 1;
	
	public var trapType : int;
	public var cought = function(player : Player, field : Labyrinth) {};
	
	function Trap() {
		name = "empty";
		type = TYPE_TRAP;
		trapType = Trap.TYPE_EMPTY;
		toString = function() : String {
			return "trap: " + name;
		};
		cought = function(player : Player, field : Labyrinth) {};
	}
};

//TODO : Traps

class Landmine extends Trap {
	function Landmine() {
		super();
		name = "landmine";
		trapType = TRAP_TYPE_LAND_MINE;
		cought = function(player : Player, field : Labyrinth) {
			player.life--;
			player.alive = (player.life > 0);
			remove();
		};
	}
};
