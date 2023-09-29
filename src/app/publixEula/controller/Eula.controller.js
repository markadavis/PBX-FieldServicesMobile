sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.publix.eula.controller.Eula", {

		onInit: function() {
			this._oComponent = this.getOwnerComponent();
			this._oRouter = this._oComponent.getRouter();
			this._oResourceBundle = this._oComponent.getModel("i18n").getResourceBundle();

			this.oView.setModel(new JSONModel({
				busy: true,
				busyIndicatorDelay: 0,
				debugging: false,
				dbgpwd: "",
				EulaDocument: {
					Version: "1.0",
					Title: this._oResourceBundle.getText("appTitle"),
					Text: this._oResourceBundle.getText("EULA")
				}
			}), "eula");

			this._oRouter.getRoute("eula").attachPatternMatched(this._onRouteMatched, this);
		},



		/* ================================================== */
		/*  Event Handler Methods                             */
		/* ================================================== */

		onVendorPress: function(oEvent) {
			if (this._oComponent.getUseLocalLogon()) {
				this._oRouter.navTo("vendorLogon", {});	//, true/*replace history*/);
			} else {
				this._oRouter.navTo("vendorRedirect");
			}
		},

		onAssociatePress: function(oEvent) {
			if (this._oComponent.getUseLocalLogon()) {
				this._oRouter.navTo("associateLogon");	//, {}, true/*replace history*/);
			} else {
				this._oRouter.navTo("associateRedirect");
			}
		},

		onChangeSystem: function(oEvent) {
			// Show Footer.
			this.oView.getModel("eula").setProperty("/debugging", true/*replace history*/);
		},

		onDwgPwd: function(oEvent) {
			if (this.oView.getModel("eula").getProperty("/dbgpwd") === "!Pbx-001*$4dbg") {
				// Hide Footer.
				this.oView.getModel("eula").setProperty("/debugging", false);
				this.oView.getModel("eula").setProperty("/dbgpwd");

				// Change the Service URI:
				if (PUBLIX_APP_CONFIG.SYSTEM && PUBLIX_APP_CONFIG.SYSTEM.charAt(0) === "D") {
					PUBLIX_APP_CONFIG.SYSTEM = "QA";
					alert (`Changed!  (${PUBLIX_APP_CONFIG.SYSTEM.charAt(0)})`);
				} else if (PUBLIX_APP_CONFIG.SYSTEM) {
					delete PUBLIX_APP_CONFIG.SYSTEM;	// Production
					alert (`Changed!`);
				} else {
					PUBLIX_APP_CONFIG.SYSTEM = "DEV"
					alert (`Changed!  (${PUBLIX_APP_CONFIG.SYSTEM.charAt(0)})`);
				}

				// Reset the EULA acceptance status.
				let oStatus = this._oComponent.getEulaStatus();
				if (oStatus) {
					oStatus.AcceptedOn = null;
					this._oComponent.setEulaStatus(oStatus);
				}

				// Restart the app.
				this._oRouter.navTo("startup");
			} else {
				// Hide Footer.
				this.oView.getModel("eula").setProperty("/debugging", false);
				this.oView.getModel("eula").setProperty("/dbgpwd");

				// Reset the EULA acceptance status.
				delete PUBLIX_APP_CONFIG.SYSTEM;
				let oStatus = this._oComponent.getEulaStatus();
				if (oStatus) {
					oStatus.AcceptedOn = null;
					this._oComponent.setEulaStatus(oStatus);
				}

				// Restart the app.
				this._oRouter.navTo("startup");
			}
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
			this.oView.setBusy(false);
		}

	});
});