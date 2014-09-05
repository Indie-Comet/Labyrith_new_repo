#pragma strict

class my {
	static function swap(a : Object, b : Object) {
		var c : Object = a;
		a = b;
		b = c;
		Debug.Log(a.ToString() + ' ' + b.ToString());
	}
}

class Algorithm {
	static function randomShuffle(a : Array) {
		for (var i : int = 0; i < a.length - 1; i++) {
			var pos : int = Mathf.RoundToInt(Random.Range(i + 0.5 + float.Epsilon, a.length - 0.5 - float.Epsilon));
			var tmp = a[i];
			a[i] = a[pos];
			a[pos] = tmp;
		}
	} 
}

class MyQueue {
	private var data : Object[];
	var head : int;
	var tail : int;	
	var size : int;
	public function MyQueue(maxSize : int) {
		size = maxSize;
		data = new Object[maxSize];
		head = 0;
		tail = 0;
	}
	
	public function push(a) {
		data[tail++] = a;
		tail = tail % size;
	}
	
	public function pop() : Object {
		var a = data[head++];
		head = head % size;
		return a;
	}
	
	public function empty() {
		return head == tail;
	}
};
