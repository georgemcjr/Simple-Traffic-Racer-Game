function Car() {

	var step = 0.1;

	var positions = [0, 1, 2, 3];
	var currentLane = positions[0];
	var nextLane = positions[0];
	var carImage = new Image();
	var isColliding = false;
	
	var carTypeArray = ["Ambulance.png", "Audi.png", "Black_viper.png", 
		"Car.png", "Mini_truck.png", "Mini_van.png",
		"Police.png", "taxi.png", "truck.png"];

	var cor = 0;
	var self = this;

	this.lowerImpossibleZone = 100;
	this.upperImpossibleZone = 500;

	this.initialize = function(initialPosition, carType, carIdPar) {

		cor = 0;

		this.nearMyFront = false;
		this.nearMyBack = false;
		this.carNearMyFront;
		this.carNearMyBack;
		this.isSliding = false;
		this.passedInPothole = false;

		this.carSpeed = 0.0;
		this.carId = carIdPar;
		currentLane = positions[0];
		nextLane = positions[0];
		carImage.src = "sprites/" + carTypeArray[carType];

		this.isMovingLeft = false;
		this.isMovingRight = false;
		
		this.y = initialPosition;

		this.height = 100;
		this.width = 60;

		this.collisionArea = {
			x : self.x + 50,
			y : self.y + 15,
			height : self.height - 40,
			width : self.width - 25
		};

		this.updatePositionXAccordingLane(currentLane);

	}

	this.getCurrentLane = function() {
		return currentLane;
	}

	this.moveToLeft = function() {
	 	if ( !(this.isMovingRight || this.isMovingLeft)) {
			if (currentLane > positions[0]) {
				nextLane = currentLane - 1;
				this.movingLeft();
				this.isMovingLeft = true;
				this.isMovingRight = false;
			}
		}
	}

	this.moveToRight = function() {
		if ( !(this.isMovingRight || this.isMovingLeft)) {
			if (currentLane < positions[positions.length - 1]) {
				nextLane = currentLane + 1;
				this.movingRight();
				this.isMovingLeft = false;
				this.isMovingRight = true;
			}
		}
	}

	this.movingLeft = function() {
		if (this.isMovingLeft) {
			currentLane -= step;
		}
		if (currentLane <= nextLane) {
			this.isMovingLeft = false;
			currentLane = nextLane;
		}
	}

	this.movingRight = function() {
		if (this.isMovingRight) {
			currentLane += step;
		}
		if (currentLane >= nextLane) {
			this.isMovingRight = false;
			currentLane = nextLane;
		}
	}

	this.update = function() {
		
		if (this.carNearMyBack) {
			this.increaseSpeed(0.001);

			// this.carNearMyBack.decreaseSpeed(0.005);
			
			if (CollisionDetection.isNearY(this.collisionArea, this.carNearMyBack.collisionArea, 40)) {
				this.carSpeed = this.carNearMyBack.carSpeed;
			}
		}

	}

	this.drawCar = function(context) {

	    if (this.isMovingLeft) {
			this.movingLeft();
			this.updatePositionXAccordingLane(currentLane);
		}

		if (this.isMovingRight) {
			this.movingRight();
			this.updatePositionXAccordingLane(currentLane);
		}

	    context.drawImage(carImage, this.x, this.y, 100, 100);
	    
	    if (GameConfig.debug.showCarId) {
	    	context.fillText(this.carId, this.x + 10, this.y - 10);	
	    }
	    
	    if (GameConfig.debug.showCollisionArea) {
	    	context.strokeRect(this.collisionArea.x, this.collisionArea.y, 
	    	this.collisionArea.width, this.collisionArea.height);	
	    }
	    
	    this.drawNearFrontAlert(context);
		// this.drawNearBackAlert(context);

		if (this.isSliding) {
			var slideSide = Math.random();
			// Slide car to random position
			if (slideSide < 0.5) {
				this.moveToLeft();
			} else {
				this.moveToRight();
			}
			this.isSliding = false;
		} 

	}

	this.drawNearFrontAlert = function(context) {
		if (this.carNearMyFront) {
	    	var color1 = "red";
	    	var color2 = "yellow";
	    	
	    	if (cor < 10) {
	    		cor++;
	    		color1 = "red";
	    		color2 = "yellow";
	    	} else {
				color2 = "red";
	    		color1 = "yellow";
	    		cor = 0;
	    	}
	    	Util.drawTextWithShadow(context, "WATCH OUT!!! " + this.carNearMyFront.carId
	    		, this.x - 30, this.y - 20, color1, 0, 0, color2);
	    }
	}

	this.drawNearBackAlert = function(context) {
		if (this.carNearMyBack) {
	    	var color1 = "red";
	    	var color2 = "yellow";
	    	
	    	if (cor < 10) {
	    		cor++;
	    		color1 = "red";
	    		color2 = "yellow";
	    	} else {
				color2 = "red";
	    		color1 = "yellow";
	    		cor = 0;
	    	}
	    	Util.drawTextWithShadow(context, "BACK " + this.carNearMyBack.carId, 
	    		this.x - 30, this.y + 120, color1, 0, 0, color2);
	    }
	}

	this.updatePositionXAccordingLane = function(lane) {
		this.x = lane * 120 + 170;
		this.collisionArea.x = this.x + 32;
	}

	this.setY = function(yPosition) {
		this.y = yPosition;
		this.collisionArea.y = this.y + 8;
	}

	this.getY = function() {
		return this.y;
	}

	this.setCurrentLane = function(lanePar) {
		if (lanePar < 0) {
			currentLane = positions[0];
		} else if(lanePar > positions.length) {
			currentLane = positions[positions.length - 1];
		} else {
			currentLane = positions[lanePar];
		}
		this.updatePositionXAccordingLane(currentLane);
	}

	this.setCarSpeed = function(speed) {
		if (speed <= GameConfig.traffic.minCarSpeed) {
			this.carSpeed = 1 - GameConfig.traffic.minCarSpeed;
		} else if (speed >= GameConfig.traffic.maxCarSpeed) {
			this.carSpeed = 1 - GameConfig.traffic.maxCarSpeed;
		} else {
			this.carSpeed = 1 - speed;
		}
	}

	this.getCarSpeed = function() {
		return 1 - this.carSpeed;
	}

	this.decreaseSpeed = function(amount) {
		var newSpeed = this.getCarSpeed() - amount;
		this.setCarSpeed(newSpeed);
	}

	this.increaseSpeed = function(amount) {
		var newSpeed = this.getCarSpeed() + amount;
		this.setCarSpeed(newSpeed);
	}

	this.getCarTypeNumber = function() {
		return carTypeArray.length;
	}

	this.setIsColliding = function(isCollidingPar) {
		isColliding = isCollidingPar;
	}

	this.getIsColliding = function() {
		return isColliding;
	}

	this.getCarImage = function() {
		return carImage;
	}

}
