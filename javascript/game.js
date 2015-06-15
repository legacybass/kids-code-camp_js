(function() {
	var guyElement = document.querySelector('.good-guy');
	var crabElement = document.querySelector('.crab');
	var gameArea = document.querySelector('.game-area');
	var bullet = document.querySelector('.bullet');

	var gameWidth = getWidth(gameArea);
	var gameHeight = getWidth(gameArea);

	var guyWidth = getWidth(guyElement);
	var guyHeight = getHeight(guyElement);

	var crabWidth = getWidth(crabElement);
	var crabHeight = getHeight(crabElement);

	var guy = {
		element: guyElement,
		width: guyWidth,
		height: guyHeight,
		direction: "Up"
	};

	var crab = {
		element: crabElement,
		width: crabWidth,
		height: crabHeight
	};

	window.addEventListener("keydown", function (key) {
		switch(key.which) {
			case 40:
				guy.direction = "Down";
				moveCharacter(guy.element, guy.direction);
				rotateCharacter(guy.element, guy.direction);
				break;
			case 37:
				guy.direction = "Left";
				moveCharacter(guy.element, guy.direction);
				rotateCharacter(guy.element, guy.direction);
				break;
			case 39:
				guy.direction = "Right";
				moveCharacter(guy.element, guy.direction);
				rotateCharacter(guy.element, guy.direction);
				break;
			case 38:
				guy.direction = "Up";
				moveCharacter(guy.element, guy.direction);
				rotateCharacter(guy.element, guy.direction);
				break;
			case 32:
				shoot(guy.direction);
				break;
		}
	});

	function getLeftValue(character) {
		var left = getComputedStyle(character)["left"];
		left = left.replace('px', '');
		left = parseInt(left);
		return left;
	}

	function getTopValue(character) {
		var top = getComputedStyle(character)["top"];
		top = top.replace('px', '');
		top = parseInt(top);
		return top;
	}

	function getWidth(character) {
		var width = getComputedStyle(character)['width'];
		width = width.replace('px', '');
		return parseInt(width);
	}

	function getHeight(character) {
		var height = getComputedStyle(character)['height'];
		height = height.replace('px', '');
		return parseInt(height);
	}

	function shoot(direction) {
		var top = getTopValue(guy.element);
		var left = getLeftValue(guy.element);
		
		if(direction === "Up") {
			bullet.style.top = (top - 5) + "px";
			bullet.style.left = (left + 33) + "px";
		}
		else if(direction === "Down") {
			bullet.style.top = (top + 55) + "px";
			bullet.style.left = (left + 7) + "px";
		}
		else if(direction === "Left") {
			bullet.style.top = (top + 18) + "px";
			bullet.style.left = (left - 5) + "px";
		}
		else if(direction === "Right") {
			bullet.style.top = (top + 40) + "px";
			bullet.style.left = (left + 55) + "px";
		}
		
		bullet.style.display = 'block';
		
		//Here is where we will move the bullet
		//setInterval does a task repeatedly until we clear it
		var interval = setInterval(function() {
			//Let's grab the top value of the bullet, just like
			//we did with the top and left above for the good-guy
			var bulletTop = getTopValue(bullet);
			var bulletLeft = getLeftValue(bullet);
			
			if(direction == "Up") {
				//If the bullet's top is already -10px away,
				//Let's clearInterval (stop the interval) 
				//and set the bullet to display none so it goes
				//invisible
				if (bulletTop < -10) {
					bullet.style.display = "none";
					clearInterval(interval);
				} else {
					//Otherwise, move the bullet up 10px
					bullet.style.top = (bulletTop - 10) + "px";
				}
			}
			else if(direction === "Down") {
				if (bulletTop > gameHeight) {
					bullet.style.display = "none";
					clearInterval(interval);
				} else {
					//Otherwise, move the bullet up 10px
					bullet.style.top = (bulletTop + 10) + "px";
				}
			}
			else if(direction === "Left") {
				if(bulletLeft < -10) {
					bullet.style.display = "none";
					clearInterval(interval);
				}
				else {
					bullet.style.left = (bulletLeft - 10) + "px";
				}
			}
			else if(direction === "Right") {
				if(bulletLeft > gameWidth) {
					bullet.style.display = "none";
					clearInterval(interval);
				}
				else {
					bullet.style.left = (bulletLeft + 10) + "px";
				}
			}
		}, 5) //<-- change this number to 
			//    make the bullet go slower or faster
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

	function rotateCharacter(character, direction) {
		switch(direction) {
			case "Up":
				character.style.transform = "rotate(0deg)";
				break;
			case "Down":
				character.style.transform = "rotate(180deg)";
				break;
			case "Left":
				character.style.transform = "rotate(270deg)";
				break;
			case "Right":
				character.style.transform = "rotate(90deg)";
				break;
		}
	}

	(function moveEnemy() {
		// This function will control moving the crab around the good guy
		
		// setInterval will repeatedly call this code
		// it will allow the crab to move on its own
		setInterval(function () {
			// Get a random direction for him to move
			var randomValue = Math.floor(Math.random() * 4);
			switch(randomValue) {
				case 0:
					moveCharacter(crab.element, "Up");
					break;
				case 1:
					moveCharacter(crab.element, "Down");
					break;
				case 2:
					moveCharacter(crab.element, "Left");
					break;
				case 3:
					moveCharacter(crab.element, "Right");
					break;
			}
		}, 1500)
	})();
})();