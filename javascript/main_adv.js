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
		const _bounds = new WeakMap();
		const _isFiring = new WeakMap();
		const _firingToken = new WeakMap();
		
		const movementAmount = 10;
		const movementFrequency = 10;
		
		return class Bullet {
			get X() { return _x.get(this); }
			get Y() { return _y.get(this); }
			
			constructor ({ element, bounds } = {}) {
				_x.set(this, Helpers.getLeft(element));
				_y.set(this, Helpers.getTop(element));
				_element.set(this, element);
				_bounds.set(this, bounds);
				_isFiring.set(this, false);
			}
			
			Move({ x, y, direction }) {
				if(_isFiring.get(this))
					clearInterval(_firingToken.get(this));
				
				_x.set(this, x);
				_y.set(this, y);
				
				let bounds = _bounds.get(this);
				
				let element = _element.get(this);
				element.style.top = `${y}px`;
				element.style.left = `${x}px`;
				element.style.display = 'block';
				
				let token = setInterval(() => {
					if(y <= bounds.top || y >= (bounds.top + bounds.height)) {
						clearInterval(token);
						element.style.display = 'none';
						return;
					}
					if(x <= bounds.left || x >= (bounds.left + bounds.width)) {
						clearInterval(token);
						element.style.display = 'none';
						return;
					}
					
					if(direction === Directions.Up) {
						y -= movementAmount;
					}
					else if(direction === Directions.Down) {
						y += movementAmount;
					}
					else if(direction === Directions.Left) {
						x -= movementAmount;
					}
					else if(direction === Directions.Right) {
						x += movementAmount;
					}
					
					element.style.top = `${y}px`;
					element.style.left = `${x}px`;
					_x.set(this, x);
					_y.set(this, y);
				}, movementFrequency);
				
				_isFiring.set(this, true);
				_firingToken.set(this, token);
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
		const _bullet = new WeakMap();
		
		const movementAmount = 25;
		
		// The hero must have a height and width. We also store his movement direction and
		// the DOM element being used to show him or her.
		return class Hero {
			get Width() { return _width.get(this); }
			get Height() { return _height.get(this); }
			
			constructor({ width = 50, height = 50, element, direction = Directions.Up, bounds, bullet } = {}) {
				_width.set(this, width);
				_height.set(this, height);
				_element.set(this, element);
				_direction.set(this, direction);
				_bounds.set(this, bounds);
				_bullet.set(this, bullet);
				
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
				else
					return;
				
				_x.set(this, x);
				_y.set(this, y);
				element.style.left = `${x}px`;
				element.style.top = `${y}px`;
				element.style.transform = `rotate(${rotation}deg)`;
				_direction.set(this, direction);
			}
			
			Shoot() {
				let x = _x.get(this),
					y = _y.get(this),
					direction = _direction.get(this);
				
				switch(direction) {
				case Directions.Up:
					y -= this.Height * 0.1;
					x += this.Width * 0.66;
					break;
				case Directions.Down:
					y += this.Height * 1.1;
					x += this.Width * 0.14;
					break;
				case Directions.Left:
					y += this.Height * 0.25;
					x -= this.Width * 0.2;
					break;
				case Directions.Right:
					y += this.Height * 0.62;
					x += this.Width * 1.1;
					break;
				}
				
				_bullet.get(this).Move({
					x, y,
					direction: direction
				});
			}
		};
	})();
	
	const Enemy = (function () {
		const _width = new WeakMap();
		const _height = new WeakMap();
		const _element = new WeakMap();
		const _alive = new WeakMap();
		const _isAttacking = new WeakMap();
		const _x = new WeakMap();
		const _y = new WeakMap();
		const _bounds = new WeakMap();
		
		const movementAmount = 15;
		const movementFrequency = 1000;
		
		// The enemy has a width and height like the hero. It also has a DOM element.
		return class Enemy {
			get Width() { return _width.get(this); }
			get Height() { return _height.get(this); }
			get IsAlive() { return _alive.get(this); }
			set IsAlive(value) { _alive.set(this, value); }
			get IsAttacking() { return _isAttacking.get(this); }
			
			constructor({ width = 50, height = 50, element, bounds } = {}) {
				_width.set(this, width);
				_height.set(this, height);
				_element.set(this, element);
				_alive.set(this, true);
				_isAttacking.set(this, false);
				_bounds.set(this, bounds);
				
				// Use these to store the hero's position
				_x.set(this, Helpers.getLeft(element));
				_y.set(this, Helpers.getTop(element));
			}
			
			Attack() {
				if(_isAttacking.get(this))
					return;
					
				_isAttacking.set(this, true);
				
				const token = setInterval(() => {
					const randomValue = Math.floor(Math.random() * 4);
					switch(randomValue) {
					case 0:
						this.Move(Directions.Up);
						break;
					case 1:
						this.Move(Directions.Down);
						break;
					case 2:
						this.Move(Directions.Left);
						break;
					case 3:
						this.Move(Directions.Right);
						break;
					}
					
					if(!_isAttacking.get(this))
						clearInterval(token);
				}, movementFrequency);
			}
			
			Move(direction) {
				let element = _element.get(this);
				let x = _x.get(this);
				let y = _y.get(this);
				let bounds = _bounds.get(this);
				
				// We check the hero's movement direction and move him that way. We use the
				// style of the element to make him move.
				if(direction === Directions.Down) {
					y = Math.min(y + movementAmount, (bounds.top + bounds.height) - (this.Height * 0.75));
				}
				else if(direction === Directions.Up) {
					y = Math.max(y - movementAmount, bounds.top);
				}
				else if(direction === Directions.Left) {
					x = Math.max(x - movementAmount, bounds.left);
				}
				else if(direction === Directions.Right) {
					x = Math.min(x + movementAmount, (bounds.left + bounds.width)  - (this.Width * 0.75));
				}
				
				_x.set(this, x);
				_y.set(this, y);
				element.style.left = `${x}px`;
				element.style.top = `${y}px`;
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
				let bullet = new Bullet({
					x: 0,
					y: 0,
					element: hero.bullet,
					bounds
				});
				_hero.set(this, new Hero({ width: hero.width, height: hero.height, element: hero.element, bounds, bullet }));
				
				const enemyObjs = enemies.map(n => new Enemy({ width: n.width, height: n.height, element: n.element, bounds }));
				_enemies.set(this, enemyObjs);
			}
			
			Init() {
				// This allows us to watch for key presses. When the user hits a key, we can tell the hero to move.
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
					case 32: // This is the space key
						_hero.get(this).Shoot();
						break;
					}
				});
				
				_enemies.get(this).forEach(n => n.Attack());
			}
		};
	})();
	
	const hero = document.querySelector('.good-guy');
	const crab = document.querySelector('.crab');
	const bullet = document.querySelector('.bullet');
	
	const game = new Game({
		hero: { element: hero, width: Helpers.getWidth(hero), height: Helpers.getHeight(hero), bullet },
		enemies: [{ element: crab, width: Helpers.getWidth(crab), height: Helpers.getHeight(crab) }]
	});
	game.Init();
})();