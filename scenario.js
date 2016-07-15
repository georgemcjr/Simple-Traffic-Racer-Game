function Scenario() {

	var roadImage = new Image();	
	var roadImageWidth = 500;
	var roadImageHeight = 600;

	this.initialize = function(canvas) {
		this.canvas = canvas;
		this.canvas.style.backgroundColor = 'gray';

		this.x = (canvas.width / 2) - (roadImageWidth / 2);
		this.y = 0;
		this.y2 = -roadImageHeight;

		roadImage.src = "sprites/scenario/road.jpg";

	}

	this.drawRoad = function(context) {
		context.drawImage(roadImage, this.x, this.y, roadImageWidth, roadImageHeight);
		context.drawImage(roadImage, this.x, this.y2, roadImageWidth, roadImageHeight);

		if (this.isThereOil()) {
			this.oil.draw(context);
		}

		if (this.isTherePothole()) {
			this.pothole.draw(context);	
		}
		
	}

	this.updateRoad = function(emptyLane) {
		this.y += 1;
	  	if (this.y >= roadImageHeight) {
	    	this.y = 0;
	  	}

	  	this.y2 += 1;
	  	if (this.y2 >= 0) {
	  		this.y2 = -roadImageHeight;
	  	}
  	
  		if (this.hasObstaclesOnRoad()) {
	  		this.updateObstacles();
  		} else {
  			this.tryPutAnObstacleOnRoad(emptyLane);
  		}
  		
	}

	this.updateObstacles = function() {
		if (this.isThereOil()) {
			this.oil.update(this.canvas.height);
	  	}

	  	if (this.isTherePothole()) {
		  	this.pothole.update(this.canvas.height);	
	  	}
	}

	this.tryPutAnObstacleOnRoad = function(emptyLane) {
		var newObstacleProbability = Math.random()

		if (newObstacleProbability < 0.002) {
			this.putAnObstacleOnRoad(emptyLane);
		}
	}

	this.putAnObstacleOnRoad = function(emptyLane) {
		var typeObstacleProbability = Math.random();

		if (typeObstacleProbability < 0.7) {
			this.createPothole(emptyLane);
		} else {
			this.createOil(emptyLane);
		}

	}

	this.createPothole = function(emptyLane) {
		if (!this.pothole) {
			this.pothole = new Obstacle();	
		}		
		this.pothole.initialize(emptyLane, GameConfig.obstacle.pothole);
	}

	this.createOil = function(emptyLane) {
		if (!this.oil) {
			this.oil = new Obstacle();	
		}
		this.oil.initialize(emptyLane, GameConfig.obstacle.oil);
	}

	this.hasObstaclesOnRoad = function() {
		return this.isThereOil() || this.isTherePothole();
	}

	this.isThereOil = function() {
		return this.oil && this.oil.isOnRoad;
	}

	this.isTherePothole = function() {
		return this.pothole && this.pothole.isOnRoad;
	}



}
