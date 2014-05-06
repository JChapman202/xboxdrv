"use strict";

var _ = require('lodash');

var Controller = require("./Controller");

var childProcess = require('child_process');
var spawn = childProcess.spawn;

var controller = new Controller({ leftRange: { min: -8000, max: 6000}, rightRange: { min: -8000, max: 6000 }});

childProcess.exec('rmmod xpad', startXbox);

function startXbox() {
	var xboxdrv = spawn('xboxdrv', ['--dpad-as-button', '--detach-kernel-driver']);

	xboxdrv.stdout.on('data', function(data) {		
		var parsedData = parseData(data);

		if (parsedData !== null) {
			controller.processData(parsedData);			
		}
	});
}

function parseData(data) {
	var returnVal = null;
	data = data.toString();	

	if (data.indexOf("X1:") > -1) {
		var matches = data.match(regex.forDriverParameter());		

		returnVal = _.reduce(matches, function(result, item, index) {
			var points = item.split(":");			
			result[points[0].trim()] = parseInt(points[1].trim());			
			return result;
		}, {});
	}

	return returnVal;
}

var regex = {
	forDriverParameter: function() {
		return /([\w\d]+):\s*(-?\d+)/gi;
	}
}

module.exports = controller;