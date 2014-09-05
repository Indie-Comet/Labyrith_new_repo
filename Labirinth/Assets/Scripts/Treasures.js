#pragma strict

//Мягкое место
class Treasure extends LabyrinthObject {
	public var name : String;
	public var content : LabyrinthObject;
	
	function Treasure(Content : LabyrinthObject) {
		content = Content;
		type = TYPE_TREASURE;
		toString = function() : String {
			var res : String = "Treasure. Conntents : ";	
			res += content.toString() + " ";
			return res;
		};
	}
};
