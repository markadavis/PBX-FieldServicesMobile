sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.publix.eula.controller.Launchpad", {

		onInit: function() {
			this._oComponent = this.getOwnerComponent();
			this._oRouter = this._oComponent.getRouter();
			this._oResourceBundle = this._oComponent.getModel("i18n").getResourceBundle();
			this._iBusyIndicatorDelay = this.oView.getBusyIndicatorDelay();

			this.oView.setModel(new JSONModel({
				busy: true,
				busyIndicatorDelay: 0,
				footerVisible: false,
				apps: [
					{
						tileId: "idAppServTech",
						tileStyleClass: "sapUiSmallMargin",
						tileFooterText: "internal techs",
						tileUnitOfMeasure: "EA",
						numberidIcon: "sap-icon://locked",
						numericScale: "M",
						numericValue: "25",
						numericValueColor: "Error",
						numericIndicator: "Up"
					}
				]
			}));
			this._oViewModel = this.oView.getModel();

			this._oRouter.getRoute("launchpad").attachPatternMatched(this._onRouteMatched, this);
		},



		/* ================================================== */
		/*  Event Handler Methods                             */
		/* ================================================== */

		/**
		 * Handle tile press events - Launch the associated Firoi App.
		 * @param {sap.ui.base.Event} oEvent The 'Route Matched' event object.
		 * @public
		 */
		onTilePress(oEvent) {

		},



		/* ================================================== */
		/*  Private Methods                                   */
		/* ================================================== */

		/**
		 * Handle inbound routes to this controller.
		 * @param {sap.ui.base.Event} oEvent The 'Route Matched' event object.
		 * @private
		 */
		_onRouteMatched: function(oEvnet) {
			this._oViewModel.setProperty("/busy", false);
			this._oViewModel.setProperty("busyIndicatorDelay", this._iBusyIndicatorDelay)
		}

	});
});