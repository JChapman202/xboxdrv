"use strict";

var Range = require("./Range");
var EventEmitter = require("events").EventEmitter;
var util = require("util");

var analogStickRange = new Range(-32768, 32768);
var triggerRange = new Range(0, 255);
var analogStickPrecentRange = new Range(-100, 100);
var triggerPercentRange = new Range(0, 100);

/**
 * Xbox 360 Controller instance to manages events and button states of a single controller.
 * @param {Object} configuration Optional configuration object that includes dead zone configuration
 *                               for Xbox 360 Analog Sticks
 */
function Controller(configuration) {	
	if (configuration && configuration.leftRange) {
		this._leftRange = new Range(configuration.leftRange.min || 0, configuration.leftRange.max || 0);
	}
	else {
		this._leftRange = new Range(0, 0);
	}

	if (configuration && configuration.rightRange) {
		this._rightRange = new Range(configuration.rightRange.min || 0, configuration.rightRange.max || 0);
	}
	else {
		this._rightRange = new Range(0, 0);
	}

	this._a = false;
	this._b = false;
	this._x = false;
	this._y = false;
	this._leftBumper = false;
	this._rightBumper = false;
	this._up = false;
	this._down = false;
	this._right = false;
	this._left = false;
	this._back = false;
	this._start = false;
	this._guide = false;
	
	this._leftX = 0;
	this._leftY = 0;
	this._rightX = 0;
	this._rightY = 0;
	this._leftTrigger = 0;
	this._rightTrigger = 0;

	Object.defineProperties(this, {
		a: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._a;
			}.bind(this)
		},
		b: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._b;
			}.bind(this)
		},
		x: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._x;
			}.bind(this)
		},
		y: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._y;
			}.bind(this)
		},
		leftBumper: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._leftBumper;
			}.bind(this)
		},
		rightBumper: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._rightBumper;
			}.bind(this)
		},
		back: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._back;
			}.bind(this)
		},
		start: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._start;
			}.bind(this)
		},
		guide: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._guide;
			}.bind(this)
		},
		up: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._up;
			}.bind(this)
		},
		down: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._down;
			}.bind(this)
		},
		left: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._left;
			}.bind(this)
		},
		right: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._right;
			}.bind(this)
		},
		leftX: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._leftX;
			}.bind(this)
		},
		leftY: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._leftY;
			}.bind(this)
		},
		rightX: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._rightX;
			}.bind(this)
		},
		rightY: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._rightY;
			}.bind(this)
		},
		leftTrigger: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._leftTrigger;
			}.bind(this)
		},
		rightTrigger: {
			enumerable: true,
			configurable: false,
			get: function() {
				return this._rightTrigger;
			}.bind(this)
		}
	});
}

util.inherits(Controller, EventEmitter);

/**
 * processes the provided Plain JS Object which contains controller state
 * @param  {Object} data 
 */
Controller.prototype.processData = function(data) {
	var digital = processDigital.bind(this);
	var analog = processAnalog.bind(this);

	this._a = digital(this._a, data["A"], "a");
	this._b = digital(this._b, data["B"], "b");
	this._x = digital(this._x, data["X"], "x");
	this._y = digital(this._y, data["Y"], "y");
	this._leftBumper = digital(this._leftBumper, data["LB"], "leftBumper");
	this._rightBumper = digital(this._rightBumper, data["RB"], "rightBumper");
	this._back = digital(this._select, data["back"], "back");
	this._start = digital(this._right, data["start"], "start");
	this._guide = digital(this._guide, data["guide"], "guide");

	this._up = digital(this._up, data["du"], "up");
	this._down = digital(this._down, data["dd"], "down");
	this._left = digital(this._left, data["dl"], "left");
	this._right = digital(this._right, data["dr"], "right");

	this._leftX = analog(this._leftX, data["X1"], "leftX", analogStickRange, analogStickPrecentRange, this._leftRange);
	this._leftY = analog(this._leftY, data["Y1"], "leftY", analogStickRange, analogStickPrecentRange, this._leftRange);

	this._rightX = analog(this._rightX, data["X2"], "rightX", analogStickRange, analogStickPrecentRange, this._leftRange);
	this._rightY = analog(this._rightY, data["Y2"], "rightY", analogStickRange, analogStickPrecentRange, this._rightRange);

	this._leftTrigger = analog(this._leftTrigger, data["LT"], "leftTrigger", triggerRange, triggerPercentRange);
	this._rightTrigger = analog(this._rightTrigger, data["RT"], "rightTrigger", triggerRange, triggerPercentRange);
};

/**
 * Processes a digital button on the controller and raises any necessary change events
 * @param  {Boolean} currentValue
 * @param  {Number} newValue     
 * @param  {String} buttonName
 * @return {Boolean}              new state
 */
function processDigital(currentValue, newValue, buttonName) {
	if (currentValue !== (newValue === 1)) {
		currentValue = newValue === 1;

		//TODO: need to emit on nextTick
		
		if (currentValue) {
			this.emit(buttonName + ":press", buttonName);
			this.emit("press", buttonName);
		}
		else {
			this.emit(buttonName + ":release", buttonName);
			this.emit("release", buttonName);
		}
	}

	return currentValue;
}

function processAnalog(currentValue, newValue, buttonName, inputRange, outputRange, deadzoneRange) {
	if (deadzoneRange && deadzoneRange.contains(newValue)) {
		newValue = 0;
	}

	newValue = (newValue - inputRange.min) * (outputRange.max - outputRange.min) / (inputRange.max - inputRange.min) + outputRange.min;

	
	if (currentValue !== newValue) {		
		this.emit(buttonName + ":move", newValue);
		this.emit("move", { button: buttonName, position: newValue });
	}

	return newValue;
}

module.exports = Controller;