(function () {
	const Directions = {
		get Up() { return 'Up'; },
		get Down() { return 'Down'; },
		get Left() { return 'Left'; },
		get Right() { return 'Right'; }
	};
	
	const Hero = (function () {
		const _width = new WeakMap();
		const _height = new WeakMap();
		const _element = new Weakmap();
		const _direction = new WeakMap();
		
		return class Hero {
			get Width() { return _width.get(this); }
			get Height() { return _height.get(this); }
			
			constructor({ width = 50, height = 50, element, direction = Directions.Up } = {}) {
				_width.set(this, width);
				_height.set(this, height);
				_element.set(this, element);
				_direction.set(this, direction);
			}
		};
	})();
	
	const Enemy = (function () {
		const _width = new WeakMap();
		const _height = new WeakMap();
		const _element = new WeakMap();
		
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
})();