(function () {
	const Directions = {
		get Up() { return 'Up'; },
		get Down() { return 'Down'; },
		get Left() { return 'Left'; },
		get Right() { return 'Right'; }
	};
	
	const Helpers = (function () {
		let getValue = (prop, element) => {
			let value = getComputedStyle(element)[prop];
			value = value.replace('px', '');
			return parseInt(value, 10);
		};
		
		return {
			getWidth: getValue.bind(null, 'width'),
			getHeight: getValue.bind(null, 'height'),
			getLeft: getValue.bind(null, 'left'),
			getTop: getValue.bind(null, 'top')
		};
	})();
	
	const Bullet = (function () {
		const _x = new WeakMap();
		const _y = new WeakMap();
		const _element = new WeakMap();
		
		return class Bullet {
			get X() { return _x.get(this); }
			get Y() { return _y.get(this); }
			
			constructor ({ x, y, element } = {}) {
				_x.set(this, x);
				_y.set(this, y);
				_element.set(this, element);
			}
		};
	})();
	
	const Hero = (function () {
		// Since JS doesn't have "private", we use these to hold private references for us.
		const _width = new WeakMap();
		const _height = new WeakMap();
		const _element = new WeakMap();
		const _direction = new WeakMap();
		const _x = new WeakMap();
		const _y = new WeakMap();
		const _bounds = new WeakMap();
		
		const movementAmount = 25;
		
		// The hero must have a height and width. We also store his movement direction and
		// the DOM element being used to show him or her.
		return class Hero {
			get Width() { return _width.get(this); }
			get Height() { return _height.get(this); }
			
			constructor({ width = 50, height = 50, element, direction = Directions.Up, bounds } = {}) {
				_width.set(this, width);
				_height.set(this, height);
				_element.set(this, element);
				_direction.set(this, direction);
				_bounds.set(this, bounds);
				
				// Use these to store the hero's position
				_x.set(this, Helpers.getLeft(element));
				_y.set(this, Helpers.getTop(element));
			}
			
			Move(direction) {
				let element = _element.get(this);
				let x = _x.get(this);
				let y = _y.get(this);
				let bounds = _bounds.get(this);
				let rotation = 0;
				
				// We check the hero's movement direction and move him that way. We use the
				// style of the element to make him move.
				if(direction === Directions.Down) {
					y = Math.min(y + movementAmount, (bounds.top + bounds.height) - (this.Height * 0.75));
					rotation = 180;
				}
				else if(direction === Directions.Up) {
					y = Math.max(y - movementAmount, bounds.top);
					rotation = 0;
				}
				else if(direction === Directions.Left) {
					x = Math.max(x - movementAmount, bounds.left);
					rotation = 270;
				}
				else if(direction === Directions.Right) {
					x = Math.min(x + movementAmount, (bounds.left + bounds.width)  - (this.Width * 0.75));
					rotation = 90;
				}
				
				_x.set(this, x);
				_y.set(this, y);
				element.style.left = `${x}px`;
				element.style.top = `${y}px`;
				element.style.transform = `rotate(${rotation}deg)`;
			}
		};
	})();
	
	const Enemy = (function () {
		const _width = new WeakMap();
		const _height = new WeakMap();
		const _element = new WeakMap();
		
		// The enemy has a width and height like the hero. It also has a DOM element.
		return class Enemy {
			get Width() { return _width.get(this); }
			get Height() { return _height.get(this); }
			
			constructor({ width = 50, height = 50, element } = {}) {
				_width.set(this, width);
				_height.set(this, height);
				_element.set(this, element);
			}
		};
	})();
	
	const Game = (function () {
		const _hero = new WeakMap();
		const _enemies = new WeakMap();
		
		/* The game class stores all game engine logic. This is where we'll keep track of our
		   different characters and parts.
		*/
		return class Game {
			/* 	Constructs the game and gets it ready for playing
				@param {Object} hero - Object containing the DOM element for the hero, and the starting x,y coordinates
				@param {Array} enemies - Array of objects containing the DOM element for the given enemy and the starting x,y coordinates
			*/
			constructor({ hero, enemies = [], left = 0, top = 0, width = 300, height = 300 } = {}) {
				const bounds = { left, top, width, height };
				_hero.set(this, new Hero({ width: hero.width, height: hero.height, element: hero.element, bounds }));
				
				const enemyObjs = enemies.map(n => new Enemy({ width: n.width, height: n.height, element: n.element, bounds }));
				_enemies.set(this, enemyObjs);
			}
			
			Init() {
				window.addEventListener('keydown', key => {
					switch (key.which) {
					case 40: // This is the down key
						_hero.get(this).Move(Directions.Down);
						break;
					case 37: // This is the left key
						_hero.get(this).Move(Directions.Left);
						break;
					case 39: // This is the right key
						_hero.get(this).Move(Directions.Right);
						break;
					case 38: // This is the up key
						_hero.get(this).Move(Directions.Up);
						break;
					case 32:
						// This is the space key
						break;
					}
				});
			}
		};
	})();
	
	const hero = document.querySelector('.good-guy');
	const crab = document.querySelector('.crab');
	
	const game = new Game({
		hero: { element: hero, width: Helpers.getWidth(hero), height: Helpers.getHeight(hero) },
		enemies: [{ element: crab, width: Helpers.getWidth(crab), height: Helpers.getHeight(crab) }]
	});
	game.Init();
})();