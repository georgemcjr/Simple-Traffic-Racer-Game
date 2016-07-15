function Oil() {

	this.width = 80;
	this.height = 70;
	this.x;
	this.y;
	this.isOnRoad;
	this.lane;

	var self = this;

	var image = new Image();

	this.initialize = function(emptyLane) {

		image.src = "sprites/obstacles/oil.png";

		this.x = this.newXPosition(emptyLane);
		this.y = -this.height;
		this.isOnRoad = true;

		this.collisionArea = {
			x : self.x,
			y : self.y,
			/* reduce collision area in order to let car's front wheels pass onto the pothole 
			before indicate a collision (this behavior is more realist) */
			height : self.height - 60,
			width : self.width
		};

	}

	this.draw = function(context) {
		
		context.drawImage(image, this.x, this.y, this.width, this.height);

		if (GameConfig.debug.showCollisionArea) {
			context.strokeRect(this.collisionArea.x, this.collisionArea.y, 
	    	this.collisionArea.width, this.collisionArea.height);	
		}
		
	}

	this.update = function(maxY) {
		this.y += 1;
		if (this.y >= maxY) {
			this.isOnRoad = false;
		} else {
			this.isOnRoad = true;
		}
		this.collisionArea.x = this.x;
		this.collisionArea.y = this.y;
	}

	this.newXPosition = function(emptyLane) {
		var newRandom = Util.getRandomIntBetweenInterval(0, GameConfig.scenario.numberOfLanes - 1);
		while (newRandom == emptyLane) {
			newRandom = Util.getRandomIntBetweenInterval(0, GameConfig.scenario.numberOfLanes - 1);
		}

		this.lane = newRandom;

		return 180 + (GameConfig.scenario.lanesSize * newRandom);
	}	
}