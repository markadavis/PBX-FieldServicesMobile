/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the sap.ui.vk.svg.Polyline class.
sap.ui.define([
	"./Element"
], function(
	Element
) {
	"use strict";

	var Polyline = function(parameters) {
		parameters = parameters || {};
		Element.call(this, parameters);

		this.type = "Polyline";
		this.points = new Float32Array(parameters.points || [ 0, 0, 100, 100 ]);
		this.closed = parameters.closed || false;

		this.setMaterial(parameters.material);
	};

	Polyline.prototype = Object.assign(Object.create(Element.prototype), { constructor: Polyline });

	Polyline.prototype.tagName = function() {
		return this.closed ? "polygon" : "polyline";
	};

	Polyline.prototype.isFillable = function() {
		return this.closed;
	};

	Polyline.prototype._expandBoundingBox = function(boundingBox, matrixWorld) {
		var strokeDelta = this.strokeWidth * 0.5;
		var points = this.points;
		for (var i = 0, l = points.length; i < l; i += 2) {
			this._expandBoundingBoxCE(boundingBox, matrixWorld, points[ i ], points[ i + 1 ], strokeDelta, strokeDelta);
		}
	};

	Polyline.prototype._setSpecificAttributes = function(setAttributeFunc) {
		setAttributeFunc("points", this.points.join(" "));
		if (this.stroke !== undefined && this.stroke[ 3 ] > 0 && this.strokeWidth > 0) {
			// setAttributeFunc("stroke-linecap", "butt");
			setAttributeFunc("stroke-linejoin", "round");
		}
	};

	return Polyline;
});
