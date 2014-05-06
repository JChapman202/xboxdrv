"use strict"

/**
 * Numerical range that tracks a minimum and maximim value and can determine if a provided value falls
 * within that range
 * @param {Number} min The minimum value (inclusive) which is considered part of this range
 * @param {Number} max The maximum value (inclusive) which is considered part of this range
 */
function Range(min, max) {
	min = min || 0;
	max = max || 0;

	Object.defineProperties(this, {
		min: {
			writable: false,
			configurable: false,
			enumerable: true,
			value: min
		},
		max: {
			writable: false,
			configurable: false,
			enumerable: true,
			value: max
		}
	});
}

Range.prototype.contains = function(value) {
	return this.min <= value && value <= this.max;
};

module.exports = Range;