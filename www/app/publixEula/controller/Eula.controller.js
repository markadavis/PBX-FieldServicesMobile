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
				this._oRouter.navTo("vendorLogon");
			} else {
				this._oRouter.navTo("vendorRedirect");
			}
		},

		onAssociatePress: function(oEvent) {
			if (this._oComponent.getUseLocalLogon()) {
				this._oRouter.navTo("associateLogon");
			} else {
				this._oRouter.navTo("associateRedirect");
			}
		},

		onChangeSystem: function(oEvent) {
			// Show Footer.
			this.oView.getModel("eula").setProperty("/debugging", true);
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
		},




		/* ================================================== */
		/*  THE IN-APP-BROWSER IS NOT USED ANY LONGER         */
		/* ================================================== */

		onRejectPress: function(oEvent) {
			var fnAfterLogoff = () => {
				/**
				 * Clear the authentication header stored in the browser.
				 * - Just call the default service with invalid credentials. When the request
				 *   fails, the authentication header will be destroyed
				 */
				$.ajax({
					type: "GET",
					url: "/sap/opu/odata/sap/ZFIORI_PUBLIX_EULA_SRV/", // any URL to a Gateway service
					username: "userdummy",	// no such user!
					password: "!$dummy$!",	// messed up :-)
					statusCode: {
						// These empty handler functions will prevent authentication pop-up in chrome/firefox.
						401: function() {	// Unauthorized
							jQuery.sap.log.info("401 received", "EULA rejected & user logged off", "com.publix.eula.Eula.controller.js");
						},
						403: function() {	// Forbidden
							jQuery.sap.log.info("403 received", "EULA rejected & user logged off", "com.publix.eula.Eula.controller.js");
						},
						407: function() {	// Proxy Authentication Required
							jQuery.sap.log.info("403 received", "EULA rejected & user logged off", "com.publix.eula.Eula.controller.js");
						}
					}
				}).done(() => {
					// Should never get here - but the reload will just show the EULA again.
					this._eulaRejectedReload();
				}).fail(() => {
					// Not authroized - should redirect to the logon page.
					this._eulaRejectedReload();
				});
			};

			//Clear SSO cookies: SAP Provided service to do that.
			$.ajax({
				type: "GET",
				url: "/sap/public/bc/icf/logoff"
			})
			.done(fnAfterLogoff.bind(this))
			.fail(fnAfterLogoff.bind(this));
		},

		_eulaAcceptedReload: function() {
			this.oView.setBusy(true);

			// Change the hash, so the mobile app can catch it and close the in-app browser.
			window.location.hash = "eulaAccepted";//eslint-disable-line
			window.location.reload(); //eslint-disable-line
			// window.location.replace(window.location); //eslint-disable-line
		},

		_eulaRejectedReload: function() {
			this.oView.setBusy(true);

			// Change the hash to reflect the EULA was rejected by the end user.
			window.location.hash = "eulaRejected"; //eslint-disable-line
			window.location.reload(); //eslint-disable-line
		}

	});
});