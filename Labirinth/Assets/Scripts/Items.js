#pragma strict

// Просто лежащий на полу итем
class Item extends LabyrinthObject {
	static public var ITEM_TYPE_EMPTY = 0;
	static public var ITEM_TYPE_FLOWER = 1;
	static public var ITEM_TYPE_ARMOR_PIERCING_BULLET = 2;
	static public var ITEM_TYPE_BULLET = 3;
	static public var ITEM_TYPE_KEY = 4;
	
	public var itemType : int;
	public var infoWindow = function(windowID : int){};
	public var hitPlayer = function(player : Player, field : Labyrinth){};
	public var hitWall = function(direction : Direction) : boolean {};
	public var use = function(player : Player, field : Labyrinth){};
	
	public var image : Texture;
	
	function Item() {
		image = new Texture();
		name = "empty";
		itemType = ITEM_TYPE_EMPTY;
		type = TYPE_ITEM;
		toString = function() : String {
			return "item: " + name;
		};
		infoWindow = function(windowID : int) {
			GUILayout.Label("--EMPTY--");
		};
		hitPlayer = function(player : Player, field : Labyrinth) {};
		use = function(player : Player, field : Labyrinth) {};
		hitWall = function(direction : Direction) : boolean {return false;};
	}
};

class ArmorPiercingBullet extends Item {
	//TODO:
	function ArmorPiercingBullet() {
		super();
	}
}

class Flower extends Item {
	//TODO:
	function Flower() {
		super();
	}
}

class Bullet extends Item {
	function Bullet() {
		image = AssetDatabase.LoadAssetAtPath("Assets/Textures/18040.jpg", typeof(Texture)) as Texture;
		itemType = ITEM_TYPE_BULLET;
		name = "bullet";
		hitPlayer = function(player : Player, field : Labyrinth) {
			player.life--;
			player.alive = player.life > 0;
		};
	}
}

class Key extends Item {
	function Key() {
		itemType = ITEM_TYPE_KEY;
		name = "key";
	}
}

//TODO: items
