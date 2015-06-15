window.addEventListener("keydown", function (key) {
	var guy = document.querySelector('.good-guy');
	switch(key.which) {
		case 40:
			moveCharacter(guy, "Down");
			break;
		case 37:
			moveCharacter(guy, "Left");
			break;
		case 39:
			moveCharacter(guy, "Right");
			break;
		case 38:
			moveCharacter(guy, "Up");
			break;
		case 32:
			shoot();
			break;
	}
});

function shoot() {
	var guy = document.querySelector('.good-guy')
	
	var top = getComputedStyle(guy)["top"]
	top = top.replace('px', '')
	top = parseInt(top)
	
	var left = getComputedStyle(guy)["left"];
	left = left.replace('px', '');
	left = parseInt(left);
	
	var bullet = document.querySelector('.bullet');
	bullet.style.top = (top - 5) + "px";
	bullet.style.left = (left + 32) + "px"
	
	bullet.style.display = 'block'
	
	//Here is where we will move the bullet
	//setInterval does a task repeatedly until we clear it
	var interval = setInterval(function() {
		//Let's grab the top value of the bullet, just like
		//we did with the top and left above for the good-guy
		var bulletTop = getComputedStyle(bullet)["top"];
		bulletTop = bulletTop.replace('px', '');
		bulletTop = parseInt(bulletTop);
		
		//If the bullet's top is already -10px away,
		//Let's clearInterval (stop the interval) 
		//and set the bullet to display none so it goes
		//invisible
		if (bulletTop < -10) {
			bullet.style.display = "none";
			clearInterval(interval)
		} else {
			//Otherwise, move the bullet up 10px
			bullet.style.top = (bulletTop - 10) + "px"
		}
	}, 5) //<-- change this number to 
				//    make the bullet go slower orfaster
}

function moveCharacter(character, direction) {
	var top = getComputedStyle(character)["top"]
	top = top.replace('px', '')
	top = parseInt(top)
	
	var left = getComputedStyle(character)["left"];
	left = left.replace('px', '');
	left = parseInt(left);
	
	var width = 300;
	var height = 300;
	
	if (direction === "Down") {
		if(top < 225) {
			top = top + 25;
		}
		else {
			top = 250;
		}
		character.style.top = top + "px";  
		
	} else if (direction === "Up") {
		if(top > 25) {
			top = top - 25;
		}
		else {
			top = 0;
		}
		character.style.top = top + "px";
		
	} else if (direction === "Right") {
		if(left < 225) {
			left = left + 25;
		}
		else {
			left = 250;
		}
		character.style.left = left + "px";
		
	} else if (direction === 'Left') {
		if(left > 25) {
			left = left - 25;
		}
		else {
			left = 0;
		}
		character.style.left = left + "px";
	}	
}

function moveEnemy() {
	// This function will control moving the crab around the good guy
	
	// Let's get the crab and the good guy
	var enemy = document.querySelector('.crab');
	var goodGuy = document.querySelector('.good-guy');
	
	// setInterval will repeatedly call this code
	// it will allow the crab to move on its own
	setInterval(function () {
		// Get a random direction for him to move
		var randomValue = Math.floor(Math.random() * 4);
		switch(randomValue) {
			case 0: moveCharacter(enemy, "Up");
				break;
			case 1: moveCharacter(enemy, "Down");
				break;
			case 2: moveCharacter(enemy, "Left");
				break;
			case 3: moveCharacter(enemy, "Right");
				break;
		}
	}, 1500)
}

moveEnemy();