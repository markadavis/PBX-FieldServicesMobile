sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.publix.eula.controller.App", {

		/**
		 * Called when the the component (aka app) is first loaded.
		 * @public
		 */
		onInit: function() {
			this._oComponent = this.getOwnerComponent();

        	this._oViewModel = new JSONModel({
                    busy: false,
                    delay: this.oView.getBusyIndicatorDelay()
                });

			this.oView.setModel(this._oViewModel, "appView");

			// Apply the content density class to the root view.
			this.oView.addStyleClass(this._oComponent.getContentDensityClass());

			// Startup the SAPUI5 Router.
			this._oComponent.getRouter().initialize();
		}

	});
});