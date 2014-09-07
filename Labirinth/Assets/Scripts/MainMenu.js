#pragma strict

enum menuMode {
	client,
	server,
	main
}

var serverButton : GUIObject;
var clientButton : GUIObject;
var backButton : GUIObject;
var nameField : GUIObject;
var createButton : GUIObject;
var connectButton : GUIObject;
var ipField : GUIObject;
var serverSettingsPos : GUIScale;
var skin : GUISkin;
var mode : menuMode;

var playerName : String;
var iStart : int = 0;
var jStart : int = 0;
private var ip : String = "localhost";

function Start() {
	var a : int = 0;
	var b : int = 1;
	Debug.Log(a.ToString() + ' ' + b.ToString());
}

function OnGUI () {		
	serverButton.normalizeFont();
	clientButton.normalizeFont();
	ipField.normalizeFont();
	nameField.normalizeFont();
	backButton.normalizeFont();
	createButton.normalizeFont();
	
	if (mode == menuMode.main) {
		var tmp : int = skin.button.fontSize;
		skin.button.fontSize = serverButton.fontSize;
		if (GUI.Button(serverButton.scale.convertScales(), serverButton.content, skin.button)) {
			mode = menuMode.server;
		}
		if (GUI.Button(clientButton.scale.convertScales(), clientButton.content, skin.button)) {
			mode = menuMode.client;
		}
		skin.textArea.fontSize = nameField.fontSize;
		playerName = GUI.TextField(nameField.scale.convertScales(), playerName, skin.textArea);
		skin.button.fontSize = tmp;
	}
	if (mode != menuMode.main) {
		if (GUI.Button(backButton.scale.convertScales(), backButton.content, skin.button)) {
			mode = menuMode.main;
		}
		//TODO:
		iStart = int.Parse(GUI.TextField(new Rect(50, 50, 100, 30), iStart.ToString()));
		jStart = int.Parse(GUI.TextField(new Rect(50, 100, 100, 30), jStart.ToString()));
	}
	if (mode == menuMode.server) {
		GUI.Window(0,
			serverSettingsPos.convertScales(), 
			GameObject.Find("Server Data").GetComponent(ServerData).serverSettingsWindow,
			"Server Settings", skin.window);
		
		if (GUI.Button(createButton.scale.convertScales(), createButton.content, skin.button)) {
			GameObject.Find("Administration").GetComponent(NetworkAdmin).launchServer(playerName, iStart, jStart);
		}
	}
	
	if (mode == menuMode.client) {
		ip = GUI.TextField(ipField.scale.convertScales(), ip, skin.textField);
		if (GUI.Button(connectButton.scale.convertScales(), connectButton.content, skin.button)) {
			GameObject.Find("Administration").GetComponent(NetworkAdmin).connectToServer(ip, iStart, jStart, playerName);
		}
	}
}
