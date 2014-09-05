#pragma strict

var startAmmo : int;
var startLife : int;
var maxPlayers : int;

var height : int;
var weight : int;
var maxSize : int = 30;
var maxCnt : int = 20;
var minSize : int = 1;
var data : LabyrinthData;

var typeInt : Array;
var scrollType : Array;
var content : Array;
var choosed : Array;
var ammoCount : Array;

var map : String = "Classic";
var skin : GUISkin; 

private var scrollPos : Vector2;

function Start() {
	ammoCount = new Array();
	data.treasures = new Array();
	typeInt = new Array();
	choosed = new Array();
	content = new Array();
	scrollType = new Array();
}

function option(value : float, name : String, minSize : float, maxSize : float) : float {
	GUILayout.BeginHorizontal();
		GUILayout.Label(name, skin.label);
		var tmp : String = value.ToString();
		if (value == -1) tmp = "";
		tmp = GUILayout.TextField(tmp);
		GUILayout.FlexibleSpace();
	GUILayout.EndHorizontal();
	if (tmp == "") value = -1; 
	else value = Mathf.Max(Mathf.Min(float.Parse(tmp), maxSize), minSize);
	return value;
}

function sliderOption(value : float, name : String, minSize : float, maxSize : float) : float {
	GUILayout.BeginHorizontal();
		GUILayout.Label(name, skin.label);
		value = GUILayout.HorizontalSlider(value, minSize, maxSize, GUILayout.Width(Screen.width / 6));
		GUILayout.Label(value.ToString(), skin.label);
		GUILayout.FlexibleSpace();
	GUILayout.EndHorizontal();
	return value;
}

function booleanOption(value : boolean, name : String) : boolean {
	GUILayout.BeginHorizontal();
		GUILayout.Label(name, skin.label);
		value = GUILayout.Toggle(value, "", skin.toggle);
		GUILayout.FlexibleSpace();
	GUILayout.EndHorizontal();
	return value;
}

/*function treasureList() {
	for (var i : int = 0; i < typeInt.Count; i++) {
		GUILayout.BeginHorizontal();
			var tmp : int = typeInt[i];
			typeInt[i] = GUILayout.Toolbar(tmp, treasureType);
			if (GUILayout.Button("X", GUILayout.Width(20))) {
				ammoCount.RemoveAt(i);
				choosed.RemoveAt(i);
				typeInt.RemoveAt(i);
				content.RemoveAt(i);
				scrollType.RemoveAt(i);
				data.treasures.RemoveAt(i);
				continue;
			}
		GUILayout.EndHorizontal();
		
		if (treasureType[typeInt[i]] != "ammo" && treasureType[typeInt[i]] != "empty") {
			scrollType[i] = GUILayout.BeginScrollView(scrollType[i], GUILayout.MinHeight(45));	
				if (treasureType[typeInt[i]] == "trap") {
					choosed[i] = GUILayout.Toolbar(choosed[i], traps);
					content[i] = traps[choosed[i]];
					data.treasures[i] = new Treasure(new Trap(content[i]));
				} else if (treasureType[typeInt[i]] == "item") {
					choosed[i] = GUILayout.Toolbar(choosed[i], items);
					content[i] = items[choosed[i]];
					var tmpS : String = content[i];
					data.treasures[i] = new Treasure(tmpS);
				}
			GUILayout.EndScrollView();
		} else if (treasureType[typeInt[i]] == "ammo") {
			ammoCount[i] = option(ammoCount[i], "Ammo Count : ", 0, maxCnt);
			var tmpI : int = ammoCount[i];
			data.treasures[i] = new Treasure(tmpI);
		} else {
			data.treasures[i] = new Treasure();
		}
		
		GUILayout.Box("", GUILayout.Height(5));
	}
	
	if (GUILayout.Button("ADD")) {
		ammoCount.Add(0);
		choosed.Add(0);
		typeInt.Add(0);
		content.Add(null);
		scrollType.Add(new Vector2(0, 0));
		data.treasures.Add(new Treasure());
	}
}*/

function serverSettingsWindow() {
	scrollPos = GUILayout.BeginScrollView(scrollPos);
	GUILayout.BeginVertical();
		GUILayout.Box("GENERAL:", skin.box);	
		weight = option(weight, "Width of field :", minSize, maxSize);
		height = option(height, "Height of field :", minSize, maxSize);
		startAmmo = option(startAmmo, "Start ammo : ", 0, maxCnt);
		startLife = option(startLife, "Start life : ", 0, maxCnt);
		data.wallProb = sliderOption(data.wallProb, "Prob of Wall : ", 0, 1);
		
		//GUILayout.Box("TREASURES:", skin.box);
		
		//treasureList();
		
		data.useRandomTreasure = booleanOption(data.useRandomTreasure, "Use random treasure");
		data.treasureCount = option(data.treasureCount, "Treasure count : ", 0, maxCnt);
		data.loveToilets = sliderOption(data.loveToilets, "Cost of wall : ", 0, 1);		
		data.staticTreasureProb = sliderOption(data.staticTreasureProb, "Treasure prob : ", 0, 1);	
		data.canPutTreasureTogether = booleanOption(data.canPutTreasureTogether, "Can put treasure together");	
	GUILayout.EndVertical();
	GUILayout.EndScrollView();
}
