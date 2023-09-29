sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(Controller, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("com.publix.eula.controller.AssociateLogon", {

		/**
		 * Called when the the component (aka app) is first loaded.
		 * @public
		 */
		onInit: function() {
			this._oComponent = this.getOwnerComponent();
			this._oRouter = this._oComponent.getRouter();
			this._oResourceBundle = this._oComponent.getModel("i18n").getResourceBundle();

			let oViewModel = new JSONModel({
				busy: false,
				delay: this.oView.getBusyIndicatorDelay(),
				userId: "",
				passwd: ""
			});

			this.oView.setModel(oViewModel, "AssociateLogonView");

			this._oRouter.getRoute("associateLogon").attachPatternMatched(this._onRouteMatched, this);
			this._oRouter.getRoute("associateRedirect").attachPatternMatched(this._onRouteMatched, this);
		},



		/* ================================================== */
		/*  Event Handler Methods                             */
		/* ================================================== */

		onCancelPress: function(oEvent) {
			history.go(-1);
		},

		onLogonPress: function(oEvent) {
			this._oComponent.associateLogon().then(oEulaStatus => {
				this._oComponent.startLaunchpad();
			}).catch(oError => {
				MessageBox.error(this._oResourceBundle.getText("appServicesUnreachable"), {
					title: this._oResourceBundle.getText("appStatusError"),
					styleClass: this._oComponent.getContentDensityClass(),
					actions: MessageBox.Action.Close,
					emphasizedAction: null,
					initialFocus: null,
					onClose: () => {
						// this._oRouter.navTo("eula", {}, true/*replace history*/);
						history.go(-1);
					}
				});
			});
		},



		/* ================================================== */
		/*  Private Methods                                   */
		/* ================================================== */

		/**
		 * Handle inbound routes to this controller.
		 * @param {sap.ui.base.Event} oEvent The 'Route Matched' event object.
		 * @private
		 */
		_onRouteMatched: function(oEvent) {

		}

	});
});