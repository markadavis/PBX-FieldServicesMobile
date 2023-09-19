sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.publix.eula.controller.MainView", {

		onInit: function() {
			this._oComponent = this.getOwnerComponent();
			this._oResourceBundle = this._oComponent.getModel("i18n").getResourceBundle();

			const oUserModel = new JSONModel();
			oUserModel.loadData("/sap/bc/ui2/start_up");
			this.oView.setModel(oUserModel, "user");

			const oEulaModel = new JSONModel();
			this.oView.setModel(oEulaModel, "eula");

			oUserModel.attachRequestCompleted((oUserData) => {
				const oDataModel = this._oComponent.getModel();
				oDataModel.metadataLoaded().then(() => {
					const sPath = oDataModel.createKey("/EulaSet", {
						UserId: oUserModel.getProperty("/id")
					});

					oDataModel.read(sPath, {
						success: (oData) => {
							if (!oData.hasOwnProperty("DateAccepted") || 
								(oData.hasOwnProperty("DateAccepted") && oData.DateAccepted)) {
								// Change the hash, so the mobile app can catch it and close the in-app browser.
								this._eulaAcceptedReload();
							} else {
								oEulaModel.setProperty("/", oData);
								this.oView.byId("mainPage").setBusy(false);
								this.oView.byId("BtnAccept").setVisible(true);
								this.oView.byId("BtnReject").setVisible(true);
							}
						},
						error: (oError)=> {
							this.oView.byId("mainPage").setBusy(false);
							// TODO - Error: EULA load failed.
						}
					});
				});
			});
		},

		onAcceptPress: function(oEvent) {
			// Update the end user's record on the server.
			this._updateUserAcceptedEULA();

			// Change the has, so the mobile app can catch it and close the in-app browser.
			this._eulaAcceptedReload();
		},

		onRejectPress: function(oEvent) {
			var fnAfterLogoff = function() {
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
							jQuery.sap.log.info("401 received", "EULA rejected & user logged off", "com.publix.eula.MainView.controller.js");
						},
						403: function() {	// Forbidden
							jQuery.sap.log.info("403 received", "EULA rejected & user logged off", "com.publix.eula.MainView.controller.js");
						},
						407: function() {	// Proxy Authentication Required
							jQuery.sap.log.info("403 received", "EULA rejected & user logged off", "com.publix.eula.MainView.controller.js");
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

		_updateUserAcceptedEULA: function() {
			const oDataModel = this._oComponent.getModel(),
				oUserModel = this.oView.getModel("user"),
				sPath = oDataModel.createKey("/EulaSet", {
					UserId: oUserModel.getProperty("/id")
				});

			oDataModel.update(sPath, { DateAccepted: new Date() }, {
				success: oData => {
				},
				error: oError => {
				}
			});
		},

		_eulaAcceptedReload: function() {
			this.oView.byId("mainPage").setBusy(true);

			// Change the hash, so the mobile app can catch it and close the in-app browser.
			window.location.hash = "eulaAccepted";//eslint-disable-line
			window.location.reload(); //eslint-disable-line
			// window.location.replace(window.location); //eslint-disable-line
		},

		_eulaRejectedReload: function() {
			this.oView.byId("mainPage").setBusy(true);

			// Change the has to reflect the EULA was rejected by the end user.
			window.location.hash = "eulaRejected"; //eslint-disable-line
			window.location.reload(); //eslint-disable-line
		}

	});
});