/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.PoiToolGizmo
sap.ui.define([
	"jquery.sap.global",
	"../thirdparty/three",
	"./Gizmo",
	"./PoiToolGizmoRenderer",
	"./CoordinateSystem",
	"./GizmoPlacementMode"
], function(
	jQuery,
	threejs,
	Gizmo,
	MoveToolGizmoRenderer,
	CoordinateSystem,
	GizmoPlacementMode
) {
	"use strict";

	var PoiToolGizmo = Gizmo.extend("sap.ui.vk.tools.PoiToolGizmo", /** @lends sap.ui.vk.tools.PoiToolGizmo.prototype */ {
		metadata: {
			library: "sap.ui.vk"
		}
	});

	PoiToolGizmo.prototype.init = function() {
		if (Gizmo.prototype.init) {
			Gizmo.prototype.init.apply(this);
		}

		this._gizmoIndex = -1;
		this._handleIndex = -1;
		this._moveDelta = new THREE.Vector3();

		this._viewport = null;
		this._tool = null;
		this._sceneGizmo = new THREE.Scene();

		this._gizmo = new THREE.Group();
		this._touchAreas = new THREE.Group();
		this._sceneGizmo.add(this._gizmo);
		this._coordinateSystem = CoordinateSystem.Local;
		this._placementMode = GizmoPlacementMode.ObjectCenter;
		this._nodes = [];
		this._matViewProj = new THREE.Matrix4();
		this._gizmoSize = 96;
	};

	PoiToolGizmo.prototype.hasDomElement = function() {
		return true;
	};

	PoiToolGizmo.prototype.show = function(viewport, tool) {
		this._viewport = viewport;
		this._tool = tool;
		this._nodes.length = 0;
		this._updateSelection(viewport._viewStateManager);
		var nodesProperties = this._getNodesProperties();
		this._tool.fireEvent("moving", { x: 0, y: 0, z: 0, nodesProperties: nodesProperties }, true);
	};

	PoiToolGizmo.prototype.hide = function() {
		this._cleanTempData();

		this._viewport = null;
		this._tool = null;
		this._gizmoIndex = this._handleIndex = -1;
	};

	PoiToolGizmo.prototype.getGizmoCount = function() {
		return this._nodes.length;
	};

	PoiToolGizmo.prototype.getTouchObject = function(i) {
		if (this._nodes.length === 0) {
			return null;
		}

		this._updateGizmoObjectTransformation(this._touchAreas, i, true);

		return this._touchAreas;
	};

	PoiToolGizmo.prototype.selectHandle = function(index, gizmoIndex) {
		this._gizmoIndex = gizmoIndex;
		this._handleIndex = index;
		this._viewport.setShouldRenderFrame();
	};

	PoiToolGizmo.prototype.beginGesture = function() {
		this._moveDelta.setScalar(0);
		this._matOrigin = this._gizmo.matrixWorld.clone();
		this._nodes.forEach(function(nodeInfo) {
			var node = nodeInfo.node;
			nodeInfo.matOrigin = node.matrixWorld.clone();
			nodeInfo.originLocal = node.position.clone();
			nodeInfo.origin = new THREE.Vector3().setFromMatrixPosition(node.matrixWorld);
			if (node.parent) {
				nodeInfo.matParentInv = new THREE.Matrix4().getInverse(node.parent.matrixWorld);
			} else {
				nodeInfo.matParentInv = new THREE.Matrix4();
			}
		});
	};

	PoiToolGizmo.prototype._getNodesProperties = function() {
		var nodesProperties = [];
		this._nodes.forEach(function(nodeInfo) {
			nodesProperties.push({ node: nodeInfo.node });
		});

		return nodesProperties;
	};

	PoiToolGizmo.prototype.endGesture = function() {
		var nodesProperties = this._getNodesProperties();
		var offsetInParam = this._moveDelta.clone();
		if (this._coordinateSystem === CoordinateSystem.Custom) {
			var gmat = new THREE.Matrix4().extractRotation(this._gizmo.matrixWorld);
			var gmatInv = new THREE.Matrix4().getInverse(gmat);
			offsetInParam.applyMatrix4(gmatInv);
		}

		this._tool.fireMoved({ x: offsetInParam.x, y: offsetInParam.y, z: offsetInParam.z, nodesProperties: nodesProperties });
	};

	PoiToolGizmo.prototype._setOffset = function(offset, gizmoIndex) {
		var nodeInfo = this._nodes[ gizmoIndex ];
		var node = nodeInfo.node;
		var matInv = new THREE.Matrix4().getInverse(node.matrixWorld);
		var scale = new THREE.Vector3().setFromMatrixScale(node.matrixWorld);
		var originPos = nodeInfo.origin.clone().applyMatrix4(matInv);
		offset = nodeInfo.origin.clone().add(offset).applyMatrix4(matInv).sub(originPos).multiply(scale);

		var nodesProperties = this._getNodesProperties();
		var offsetInParam = offset.clone();
		if (this._coordinateSystem === CoordinateSystem.Custom) {
			var gmat = new THREE.Matrix4().extractRotation(this._gizmo.matrixWorld);
			var gmatInv = new THREE.Matrix4().getInverse(gmat);
			offsetInParam.applyMatrix4(gmatInv);
		}
		if (this._tool.fireEvent("moving", { x: offsetInParam.x, y: offsetInParam.y, z: offsetInParam.z, nodesProperties: nodesProperties }, true)) {
			this._move(offset);
		}
	};

	PoiToolGizmo.prototype._move = function(offset) {
		this._moveDelta.copy(offset);

		this._nodes.forEach(function(nodeInfo) {
			var node = nodeInfo.node;
			var basis = this._extractBasis(node.matrixWorld);
			var pos = nodeInfo.origin.clone();
			pos.add(basis[ 0 ].multiplyScalar(offset.x)).add(basis[ 1 ].multiplyScalar(offset.y)).add(basis[ 2 ].multiplyScalar(offset.z));
			node.matrixWorld.setPosition(pos);
			node.matrix.multiplyMatrices(nodeInfo.matParentInv, node.matrixWorld);
			node.position.setFromMatrixPosition(node.matrix);
			node.matrixWorldNeedsUpdate = true;
		}.bind(this));

		this._viewport.setShouldRenderFrame();
	};

	PoiToolGizmo.prototype.move = function(x, y, z) {
		this.beginGesture();
		if (this._coordinateSystem === CoordinateSystem.Custom) {
			var offset = new THREE.Vector3(x, y, z);
			var gmat = new THREE.Matrix4().extractRotation(this._gizmo.matrixWorld);
			offset.applyMatrix4(gmat);
			x = offset.x;
			y = offset.y;
			z = offset.z;
		}
		this._move(new THREE.Vector3(x, y, z || 0));
	};

	PoiToolGizmo.prototype.expandBoundingBox = function(boundingBox) {
		if (this._viewport) {
			this._expandBoundingBox(boundingBox, this._viewport.getCamera().getCameraRef(), this._viewport._getLayers());
		}
	};

	PoiToolGizmo.prototype.handleSelectionChanged = function(event) {
		if (this._viewport) {
			this._updateSelection(this._viewport._viewStateManager);
			var nodesProperties = this._getNodesProperties();
			this._tool.fireEvent("moving", { x: 0, y: 0, z: 0, nodesProperties: nodesProperties }, true);
			this._gizmoIndex = this._handleIndex = -1;
		}
	};

	PoiToolGizmo.prototype._getSelectionCenter = function(target) {
		Gizmo.prototype._getSelectionCenter.apply(this, arguments);
		var center = new THREE.Vector3();
		if (this._nodes[0].node.userData.boundingBox) {
			this._nodes[0].node.userData.boundingBox.getCenter(center);
		} else {
			var boundingBox = new THREE.Box3();
			boundingBox.expandByObject(this._nodes[0].node);
			boundingBox.getCenter(center);
		}
		target.copy(center.applyMatrix4(this._nodes[0].node.matrixWorld));
	};

	PoiToolGizmo.prototype._updateGizmoTransformation = function(i, camera) {
		this._updateGizmoObjectTransformation(this._gizmo, i, true);
	};

	PoiToolGizmo.prototype._updatePoiButtons = function() {
		this._tool.updateButtons();
	};

	PoiToolGizmo.prototype.render = function() {
		jQuery.sap.assert(this._viewport && this._viewport.getMetadata().getName() === "sap.ui.vk.threejs.Viewport", "Can't render gizmo without sap.ui.vk.threejs.Viewport");

		if (this._nodes.length > 0) {
			var renderer = this._viewport.getRenderer(),
				camera = this._viewport.getCamera().getCameraRef();

			this._matViewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

			renderer.clearDepth();

			for (var i = 0, l = this.getGizmoCount(); i < l; i++) {
				this._updateGizmoTransformation(i, camera);
			}
		}

		this._updatePoiButtons();
	};

	return PoiToolGizmo;
});
