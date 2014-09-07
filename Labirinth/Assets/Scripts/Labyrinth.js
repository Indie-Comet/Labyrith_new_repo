#pragma strict
/*
 * типы стен :
 * 		wall
 * 		door
 * 		empty
 * 
 * типы мягких мест :
 * 		item
 * 		ammo
 * 		trap
 * 		empty
 * 
 * типы итемов :
 * 		bullet // не совсем итем
 * 		key
 * 
 * типы ловушек : 
 * 
 */


// TODO: Return info from item;
// AddObject - Optimize

class Direction {
	static public var UP = 0;
	static public var LEFT = 1;
	static public var DOWN = 2;
	static public var RIGHT = 3;
	static private var name : String[] = ["up", "left", "down", "right"];
	
	public var dir : int;
	function getName() : String {
		return name[dir];
	}
	
	function Direction() {
		dir = UP;
	}
	
	function Direction(a : int) {
		dir = a;
	}
	
	function Direction(a : String) {
		var c = 0;
		for (var i : String in name) {
			if (i == a) {
				dir = c;
				return;
			}
			c++;
		}
	}
	
	function turnClockwise() {
		dir = (dir + 3) % 4;
	}
	
	function turnCounterClockwise() {
		dir = (dir + 1) % 4;
	}
	
	function reverse() {
		dir = (dir + 2) % 4;
	}
}

class LabyrinthObject extends Object {
	static public var TYPE_EMPTY = 0;
	static public var TYPE_ITEM = 1;
	static public var TYPE_PLAYER = 2;
	static public var TYPE_TRAP = 3;
	static public var TYPE_TREASURE = 4;
	
	public var i : int;
	public var j : int;
	public var k : int;
	public var name : String;
	
	public var type : int;
	public var toString = function() : String{};
	
	function LabyrinthObject () {
		type = TYPE_EMPTY;
		name = "empty";
		toString = function() : String {
			return name;
		};
	}
	
	function remove() {
		type = TYPE_EMPTY;
		name = "empty";
		toString = function() : String {
			return name;
		};
	}
};

class Player extends LabyrinthObject {
	public var items : ArrayList;
	public var life : int;
	public var alive : boolean;

	function itemCount(itemType : int) : int {
		var ans : int = 0;
		for (var i : int = 0; i < items.Count; i++) {
			var tmp : Item = items[i];
			if (tmp.itemType == itemType) {
				ans++;
			}
		}
		
		return ans;
	}

	function itemCount(a : Item) : int {
		return itemCount(a.itemType);
	}
	
	function deleteItem(itemType : int) {
		var ans : int = 0;
		for (var i : int = 0; i < items.Count; i++) {
			var tmp : Item = items[i];
			if (tmp.itemType == itemType) {
				items.RemoveAt(i);
				return;
			}
		}
	}
	
	function deleteItem(a : Item) {
		deleteItem(a.itemType);
	}
		
	function Player(Name : String, Ammo : int, playerLife : int) {
		life = playerLife;
		type = TYPE_PLAYER;
		name = Name;
		alive = true;
		items = new ArrayList();
		for (var i : int = 0; i < Ammo; i++) {
			items.Add(new Bullet());
		}
		toString = function () : String {
			var tmp : String = "player: name = " + name + "; life = " + 
				life.ToString() + "; alive = " + alive.ToString()+ "; items : ";
			for (var item : Item in items) {
				tmp += '(' + item.toString() + ' )';
			}
			return tmp + ";";
		};
	}
	
	function take(corpse : Player) {
		for (var i : Item in corpse.items) {
			items.Add(i);
		}
		corpse.items = new ArrayList();
	}

	function ammo() : int {
		return itemCount(new Bullet());
	}
};

class DSU {
	private var parent : Vector2[,];
	public function DSU(w : int, h : int) {
		parent = new Vector2[h, w];
		for (var I : int = 0; I < h; I++) {
			for (var J : int = 0; J < w; J++) {
				parent[I, J] = new Vector2(I, J);
			}
		}
		k = w * h;
	}
	
	private function color(i : int, j : int) : Vector2 {
		var tmp : Vector2;
		if (parent[i, j] == Vector2(i, j)) {
			return new Vector2(i, j);
		} else {
			tmp = color(parent[i, j].x, parent[i, j].y);
			parent[i, j] = tmp;
			return tmp;
		}
	}
	
	public var k : int;
	
	public function merge(i1 : int, j1 : int, i2 : int, j2 : int) {
		var a : Vector2 = color(i1, j1);
		var b : Vector2 = color(i2, j2);
		if (a == b) {
			return;
		}
		k--;
		parent[b.x, b.y] = a;
	}
}

class LabyrinthData {
	var wallProb : float;
	var treasures : Array;
	var useRandomTreasure : boolean;
	var treasureCount : int;
	var loveToilets : float; // Если хочет ставить в сартир
	var staticTreasureProb : float;
	var canPutTreasureTogether : boolean;
}

class Labyrinth {
	public var w : int;
	public var h : int;
	public var cell : ArrayList[,];
	public var horizontWalls : String[,];
	public var verticalWalls : String[,];
	
	function Labyrinth(W : int, H : int) {
		w = W;
		h = H;
		cell = new ArrayList[h, w];
		horizontWalls = new String[h + 1, w];
		verticalWalls = new String[h, w + 1];
		for (var i : int = 0; i < h; i++) {
			for (var j : int = 0; j < w; j++) {
				cell[i, j] = new ArrayList();
			}
		}
		for (i = 0; i < h; i++) {	
			for (j = 0; j < w + 1; j++) {
				verticalWalls[i, j] = "empty";
			}
		}
		for (i = 0; i < h + 1; i++) {
			for (j = 0; j < w; j++) { 
				horizontWalls[i, j] = "empty";
			}
		}
	}
	
	private function checkPos(i : int, j : int) : boolean {
		return (i >= 0 && i < h && j >= 0 && j < w);
	}
	
	//По кордам и направлению дает новые корды.
	static function move(I : int, J : int, direct : Direction) : Vector2 {
		var i : int = I;
		var j : int = J;
		var direction : String = direct.getName();
		if (direction == "up") {
			i = i + 1;
		}
		if (direction == "down") {
			i = i - 1;
		}
		if (direction == "left") {
			j = j - 1;
		}
		if (direction == "right") {
			j = j + 1;
		}
		return Vector2(i, j);
	}

	function getWall(i : int, j : int, direct : Direction) {
		var direction : String = direct.getName();
		if (direction == "up" || direction == "down") {
			if (direction == "up") {
				i++;
			}
			return horizontWalls[i, j];
		} else {
			if (direction == "right") {
				j++;
			}
			return verticalWalls[i, j];
		}
	}
	
	function addWall(i : int, j : int, direct : Direction, wall : String) {
		var direction : String = direct.getName();
		if (direction == "up" || direction == "down") {
			if (direction == "up") {
				i++;
			}
			horizontWalls[i, j] = wall;
		} else {
			if (direction == "right") {
				j++;
			}
			verticalWalls[i, j] = new String.Copy(wall);
		}
	}
	
	function findPlayer(name : String) : Vector3 {
		var player : Player;
		for (var i : int = 0; i < h; i++) {
			for (var j : int = 0; j < w; j++) {
				var it = 0;
				for (var tmp : LabyrinthObject in cell[i, j]) {
					if (tmp.type == LabyrinthObject.TYPE_PLAYER) {
						player = tmp;
						if (player.name == name) {
							return Vector3(i, j, it);
						}
					}
					it++;
				}
			}
		}
		return Vector3(w + 1, h + 1, 1);
	}
	
	function movePlayer(name : String, direct : Direction) {
		var direction : String = direct.getName();
		var player : Player;
		var pos : Vector3 = findPlayer(name);
		
		player = cell[pos.x, pos.y][pos.z];
		cell[pos.x, pos.y].RemoveAt(pos.z);
		var tmp : Vector2 = Labyrinth.move(pos.x, pos.y, direct);
		var i : int = tmp.x;
		var j : int = tmp.y;
		cell[i, j].Add(player);
		player.i = i;
		player.j = j;
		player.k = cell[i, j].Count - 1;
	}
	
	function killPlayer(name : String) {
		Debug.Log("Try to kill : " + name);
		var playerPos : Vector3 = findPlayer(name);
		var player : Player = cell[playerPos.x, playerPos.y][playerPos.z];
		player.alive = false;
	}
	
	function addObject(i : int, j : int, item : LabyrinthObject) {
		item.i = i;
		item.j = j;
		item.k = cell[i, j].Count;
		cell[i, j].Add(item);
	}

	function makeBorder() {
		for (var r : int = 0; r < h; r++) {
			verticalWalls[r, 0] = new String.Copy("border");
			verticalWalls[r, w] = new String.Copy("border");
		}
		for (var c : int = 0; c < w; c++) {
			horizontWalls[0, c] = new String.Copy("border");
			horizontWalls[h, c] = new String.Copy("border");
		}
	}

	
	private var wasWall : boolean[,,];
	
	//settings:
	var data : LabyrinthData;

	function create() {
		wasWall = new boolean[h, w, 4];
		var dsu = new DSU(w, h);
		
		//Строит рандомный остов.
		while (dsu.k > 1) {
			var i : int = Mathf.RoundToInt(Random.Range(-0.5 + float.Epsilon, h - 0.5 - float.Epsilon));
			var j : int = Mathf.RoundToInt(Random.Range(-0.5 + float.Epsilon, w - 0.5 - float.Epsilon));
			var k : int = Mathf.RoundToInt(Random.Range(-0.5 + float.Epsilon, 4 - 0.5 - float.Epsilon));
			var newPos : Vector2 = move(i, j, new Direction(k));	
			if (checkPos(newPos.x, newPos.y)) {
				var lastk : int = dsu.k;
				dsu.merge(i, j, newPos.x, newPos.y);
				if (lastk > dsu.k) {
					wasWall[i, j, k] = true;
					wasWall[newPos.x, newPos.y, (k + 2) % 4] = true;
				}
			}
		}
		
		//Ставит  остальные стены
		for (i = 0; i < h; i++) {
			for (j = 0; j < w; j++) {
				for (k = 0; k < 4; k++) {
					if (!wasWall[i, j, k]) {
						if (Random.value < data.wallProb) addWall(i, j, new Direction(k), "wall");
					}
				}
			}
		}
		
		var pos : int = 0;
		
		//Put treasures
		for (i = 0; i <= data.treasureCount; i++) {
			var treasure : Treasure;
			if (i == 0)
				treasure = new Treasure(new Key());
			else 
				if (data.useRandomTreasure) {
					treasure = data.treasures[Mathf.FloorToInt(Random.Range(0, data.treasures.Count - float.Epsilon))];
				} else {
					treasure = data.treasures[pos++];
				}
			var treasurePos : Vector2;
			var seed : int = 0; // How many times you tried to choose
			//Choose pos:
			while (true) {
				treasurePos.x = Mathf.FloorToInt(Random.Range(0, h - float.Epsilon));
				treasurePos.y = Mathf.FloorToInt(Random.Range(0, w - float.Epsilon));
				var wallCount : int = 0;
				for (j = 0; j < 4; j++) {
					if (getWall(treasurePos.x, treasurePos.y, new Direction(j)) != "empty") 
						wallCount++;
				}
				var f : boolean = true;
				//check if other treasures here:
				if (!data.canPutTreasureTogether) {
					for (var obj : LabyrinthObject in cell[treasurePos.x, treasurePos.y]) {
						if (obj.type == LabyrinthObject.TYPE_TREASURE) {
							f = false;
						}
					}
				}
				if (!f) {
					seed++;
					continue;
				}
				
				var prob : float = wallCount * data.loveToilets + Mathf.Pow(1.1, seed) - 1 + data.staticTreasureProb;
				if (Random.value < prob) {
					addObject(treasurePos.x, treasurePos.y, treasure);
					break;
				}
				seed++;
			}
		}
		
		makeBorder();
	}
}

class GameLog extends Labyrinth {
	var previousVersion : GameLog;//Если ловушка переместила тебя.
	var player : Player;
	
	var turn : ArrayList;
	var iStart : int;
	var jStart : int;
	var iCur : int;
	var jCur : int;	
	function addObject(a : Object) {
		cell[iCur, jCur].Add(a);
	}
	
	function GameLog(w : int, h : int, ammo : int, life : int, border : boolean, i : int, j : int) {
		player = new Player("HERO", ammo, life);
		super(w, h);
		turn = new ArrayList();
		iStart = i;
		jStart = j;
		iCur = i;
		jCur = j;
		if (border) {
			makeBorder();
		}
	}
	
	function addMove(direct : Direction) {
		var direction : String = direct.getName();
		turn.Add(direction);
		var tmp : Vector2 = Labyrinth.move(iCur, jCur, direct);
		iCur = tmp.x;
		jCur = tmp.y;
	}
	
	function addWall(direct : Direction, wall : String) {
		var direction : String = direct.getName();
		if (direction == "up" || direction == "down") {
			var j : int = jCur;
			var i : int = 0;
			if (direction == "down") {
				i = iCur;
			} else {
				i = iCur + 1;
			}
			horizontWalls[i, j] = wall;
		} else {
			i = iCur;
			j = 0;
			if (direction == "left") {
				j = jCur;
			} else {
				j = jCur + 1;
			}
			verticalWalls[i, j] = wall;
		}
	}
}
