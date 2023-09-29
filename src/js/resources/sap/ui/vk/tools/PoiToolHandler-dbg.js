// Provides control sap.ui.vk.tools.PoiToolHandler
sap.ui.define([
	"sap/ui/base/EventProvider",
	"../thirdparty/three"
], function(
	EventProvider,
	threejs
) {
	"use strict";

	var PoiToolHandler = EventProvider.extend("sap.ui.vk.tools.PoiToolHandler", {
		metadata: {
		},
		constructor: function(tool) {
			this._priority = 30;
			this._tool = tool;
			this._gizmo = tool.getGizmo();
			this._rect = null;
			this._rayCaster = new THREE.Raycaster();
			this._handleIndex = -1;
			this._gizmoIndex = -1;
			this._handleAxis = new THREE.Vector3();
			this._gizmoOrigin = new THREE.Vector3();
			this._gizmoScale = 1;
			this._objectSpace = new THREE.Matrix4();
			this._mouse = new THREE.Vector2();
		}
	});

	PoiToolHandler.prototype._updateMouse = function(event) {
		var size = this.getViewport().getRenderer().getSize(new THREE.Vector2());
		this._mouse.x = ((event.x - this._rect.x) / size.width) * 2 - 1;
		this._mouse.y = ((event.y - this._rect.y) / size.height) * -2 + 1;
		this._rayCaster.setFromCamera(this._mouse, this.getViewport().getCamera().getCameraRef());
	};

	PoiToolHandler.prototype._updateHandles = function(event, hoverMode) {
		this._handleIndex = -1;
		if (event.n === 1 || (event.event && event.event.type === "contextmenu")) {
			for (var i = 0, l = this._gizmo.getGizmoCount(); i < l; i++) {
				var touchObj = this._gizmo.getTouchObject(i);
				var viewportRect = this._tool._viewport.getDomRef().getBoundingClientRect();
				var screenX = event.x - viewportRect.left;
				var screenY = event.y - viewportRect.top;
				var hit = this._tool._viewport.hitTest(screenX, screenY);
				var selectedPoi = this._tool.getSelectedPois();
				if (hit && hit.object && selectedPoi.includes(hit.object)) {
					this._handleIndex = 5;  // X-Y plane
					this._gizmoIndex = i;
					this._gizmoOrigin.setFromMatrixPosition(touchObj.matrixWorld);
					this._gizmoScale = touchObj.scale.x;
					this._objectSpace.extractRotation(touchObj.matrixWorld);
					this._objectSpace.copyPosition(touchObj.matrixWorld);
					this._handleAxis.setFromMatrixColumn(touchObj.matrixWorld, this._handleIndex - 3).normalize();
				}
			}
		}
	};

	PoiToolHandler.prototype.hover = function(event) {
		if (this._inside(event) && !this._gesture) {
			this._updateMouse(event);
			this._updateHandles(event, true);
			event.handled |= this._handleIndex >= 0;
		}
	};

	PoiToolHandler.prototype.click = function(event) {
		if (this._inside(event) && !this._gesture) {
			this._updateMouse(event);
			this._updateHandles(event, true);
			this._gizmo.selectHandle(this._handleIndex, this._gizmoIndex);
			event.handled |= this._handleIndex >= 0;
		}
	};

	var delta = new THREE.Vector3();

	PoiToolHandler.prototype._getPlaneOffset = function() {
		var ray = this._rayCaster.ray;
		delta.copy(this._gizmoOrigin).sub(ray.origin);
		var dist = this._handleAxis.dot(delta) / this._handleAxis.dot(ray.direction);
		return ray.direction.clone().multiplyScalar(dist).sub(delta);
	};

	PoiToolHandler.prototype.beginGesture = function(event) {
		if (this._inside(event) && !this._gesture) {
			this._updateMouse(event);
			this._updateHandles(event, false);
			if (this._handleIndex >= 0) {
				this._gesture = true;
				event.handled = true;
				this._gizmo.selectHandle(this._handleIndex, this._gizmoIndex);
				this._gizmo.beginGesture();
				this._dragOrigin = this._getPlaneOffset();
			}
		}
	};

	PoiToolHandler.prototype._setOffset = function(offset) {
		if (isFinite(offset.x) && isFinite(offset.y) && isFinite(offset.z)) {
			this._gizmo._setOffset(offset, this._gizmoIndex);
		}
	};

	PoiToolHandler.prototype.move = function(event) {
		if (this._gesture) {
			event.handled = true;
			this._updateMouse(event);
			if (isFinite(this._dragOrigin.x) && isFinite(this._dragOrigin.y) && isFinite(this._dragOrigin.z)) {
				this._setOffset(this._getPlaneOffset().sub(this._dragOrigin));
			}
		}
	};

	PoiToolHandler.prototype.endGesture = function(event) {
		if (this._gesture) {
			this._gesture = false;
			event.handled = true;
			this._updateMouse(event);

			this._gizmo.endGesture();
			this._dragOrigin = undefined;
			this._updateHandles(event, true);
			this.getViewport().setShouldRenderFrame();
		}
	};

	PoiToolHandler.prototype.getViewport = function() {
		return this._tool._viewport;
	};

	PoiToolHandler.prototype._getOffset = function(obj) {
		var rectangle = obj.getBoundingClientRect();
		var p = {
			x: rectangle.left + window.pageXOffset,
			y: rectangle.top + window.pageYOffset
		};
		return p;
	};

	PoiToolHandler.prototype._inside = function(event) {
		if (this._rect === null || true) {
			var id = this._tool._viewport.getIdForLabel();
			var domobj = document.getElementById(id);

			if (domobj === null) {
				return false;
			}

			var o = this._getOffset(domobj);
			this._rect = {
				x: o.x,
				y: o.y,
				w: domobj.offsetWidth,
				h: domobj.offsetHeight
			};
		}

		return (event.x >= this._rect.x && event.x <= this._rect.x + this._rect.w && event.y >= this._rect.y && event.y <= this._rect.y + this._rect.h);
	};

	return PoiToolHandler;
});