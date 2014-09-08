/* Скрипт отвечает за все что видит игрок игрока(типо кнопочки сходить влево или выстрелить)
 *  + Использует визуализатор.
 */

#pragma strict

private var netAdmin : NetworkAdmin;
private var selectedLog : GameLog;
private var visualisator : Visualisator;


function printMessage(text : String) {
	//TODO:
	Debug.Log(text);
}

function Start () {
	netAdmin = GameObject.Find("Administration").GetComponent(NetworkAdmin);
	selectedLog = netAdmin.myLog;
	visualisator = GameObject.Find("Visualisator").GetComponent(Visualisator);
}

function Update () {
	visualisator.init(selectedLog);
}

private var selectNum : int = 0;
var turn : String = "";
private var gameStarted : boolean = false;

var sellectTollbar : GUIObject;
var startButton : GUIObject;
var exitButton : GUIObject;
var GUIWindow : GUIObject;
//items
var itemsList : GUIObject;
var listRows : int;
var listColums : int;
//control buttons:
var leftButton : GUIObject;
var rightButton : GUIObject;
var upButton : GUIObject;
var downButton : GUIObject;

var skin : GUISkin;

function controls(windowID : int) {
	if (netAdmin.myTurn) {
		//TODO : картинки стрелочек.
		if (GUI.Button(rightButton.scale.convertScales(), "", skin.button)) {
			netAdmin.sendTurn("move right");
		}
		if (GUI.Button(leftButton.scale.convertScales(), "", skin.button)) {
			netAdmin.sendTurn("move left");
		}
		if (GUI.Button(upButton.scale.convertScales(), "", skin.button)) {
			netAdmin.sendTurn("move up");
		}
		if (GUI.Button(downButton.scale.convertScales(), "", skin.button)) {
			netAdmin.sendTurn("move down");
		}
		
		//Список предметов.
		skin.button.fontSize = itemsList.fontSize;
		GUILayout.BeginArea(itemsList.scale.convertScales());
			for (var i : int = 0; i < listRows; i++) {
				GUILayout.BeginHorizontal();
					for (var j : int = 0; j < listColums; j++) {
						var item : Item;
						var itemNum : int = i * listColums + j;
						if (netAdmin.myLog.player.items.Count > itemNum) { 
							item = netAdmin.myLog.player.items[itemNum];
						} else {
							item = new Item();
						}
						//TODO:size and font!
						var pressed : boolean = GUILayout.Button(item.image, skin.button, 
									GUILayout.Width(itemsList.scale.convertScales().width / listColums - 1 * listColums),
									GUILayout.Height(itemsList.scale.convertScales().height / listRows - 1 * listRows));
						
						if (pressed) {
							//TODO:
						}
						//TODO:Окошко о предмете.
					}
				GUILayout.EndHorizontal();
			}
		GUILayout.EndArea();
	}
	
	if (!gameStarted && netAdmin.isServer) {
		skin.button.fontSize = startButton.fontSize;
		
		if (GUI.Button(startButton.scale.convertScales(), "START", skin.button)) {
			GameObject.Find("Server").GetComponent(Server).startGame();
			gameStarted = true;
		}
		
		//TODO: Это не нужно.
		GUI.Button(startButton.scale.convertScales(), "START", skin.button);//   /-\ |\/|  /--
		GUI.Button(startButton.scale.convertScales(), "START", skin.button);//   | | |  |  | _ 
		GUI.Button(startButton.scale.convertScales(), "START", skin.button);//	 \_/ |  |  |-/
	}
	skin.button.fontSize = exitButton.fontSize;
	if (GUI.Button(exitButton.scale.convertScales(), "menu", skin.button)) {
		var objects : GameObject[] = FindObjectsOfType(GameObject);
		for (var a in objects) {
			Destroy(a);
		}
		Network.Disconnect();
		Application.LoadLevel("Main Menu");
	}
}

function OnGUI () {
	sellectTollbar.normalizeFont();
	startButton.normalizeFont();
	exitButton.normalizeFont();
	itemsList.normalizeFont();
	
	var otherPlayers : GameObject[] = GameObject.FindGameObjectsWithTag("GameLog");
	var names : String[] = new String[otherPlayers.length];
	for (var i : int = 0; i < otherPlayers.length; i++) {
		names[i] = otherPlayers[i].GetComponent(PlayerGameLog).playerName;
	}
	
	var tmp : GUISkin = Instantiate(skin);
	var tmpStyle = skin.GetStyle("GUIWindow");
	skin.button.fontSize = sellectTollbar.fontSize;
	selectNum = GUI.Toolbar(sellectTollbar.scale.convertScales(), selectNum, names, skin.button);
	
	if (names[selectNum] == netAdmin.playerName) {
		selectedLog = netAdmin.myLog;
	} else {
		selectedLog = otherPlayers[selectNum].GetComponent(PlayerGameLog).data;
	}
	
	GUI.Window(0, GUIWindow.scale.convertScales(), controls, "", tmpStyle);
	
	skin = tmp;
}
