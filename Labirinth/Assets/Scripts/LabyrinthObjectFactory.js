#pragma strict

function createTrap(type : int) : Trap {
	if (type == 0) return new Trap(); 
	if (type == 1) return new Landmine(); 
}

function createItem(type : int) : Item {
	if (type == 0) return new Item(); 
	if (type == 1) return new Flower(); 
	if (type == 2) return new ArmorPiercingBullet(); 
	if (type == 3) return new Bullet(); 
	if (type == 4) return new Key(); 
}
