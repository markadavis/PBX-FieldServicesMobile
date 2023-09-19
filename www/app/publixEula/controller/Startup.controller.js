sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(Controller, JSONMode, MessageBox) {
	"use strict";

	return Controller.extend("com.publix.eula.controller.Startup", {

		/**
		 * Called when the the component (aka app) is first loaded.
		 * @public
		 */
		onInit: function() {
			this._oComponent = this.getOwnerComponent();
			this._oRouter = this._oComponent.getRouter();
			this._oResourceBundle = this._oComponent.getModel("i18n").getResourceBundle();

        	this._oViewModel = new JSONMode({
                    busy: false,
                    delay: this.oView.getBusyIndicatorDelay(),
					showContacting: false
                });

			this.oView.setModel(this._oViewModel, "appView");

			// Attach the route handler.
			// this._oRouter.getRoute("app").routeMatched(this._onRouteMatched, this);
			this._oRouter.getRoute("startup").attachPatternMatched(this._onRouteMatched, this);
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
			const oEulaStatus = this._oComponent.getEulaStatus();
			const dEulaDate = oEulaStatus ? oEulaStatus.AcceptedOn ? oEulaStatus.AcceptedOn : null : null;

			if (dEulaDate && this._dateIsPast(dEulaDate)) {
				let oLogon = null;
				this._oViewModel.setProperty("/showContacting", true);

				switch (oEulaStatus.UserType) {
					case "VENDOR":
						oLogon = this._oComponent.vendorLogon();
						break;
					case "ASSOCIATE":
						oLogon = this._oComponent.associateLogon();
						break;
					default:
						this._oViewModel.setProperty("/showContacting", false);
						this._oRouter.navTo("eula", {}, true/*replace history*/);
						break;
				}

				if (oLogon) {
					oLogon.then(oEulaStatus => {
						this._oComponent.startLaunchpad();
					}).catch(oError => {
						MessageBox.error(this._oResourceBundle.getText("appServicesUnreachable"), {
							title: this._oResourceBundle.getText("appStatusError"),
							styleClass: this._oComponent.getContentDensityClass(),
							actions: MessageBox.Action.Close,
							emphasizedAction: null,
							initialFocus: null,
							onClose: () => {
								switch (oEulaStatus.UserType) {
									case "VENDOR":
										// this._oRouter.navTo("vendorLogon", true/*replace history*/);
										this._oRouter.navTo("vendorRedirect", {}, true/*replace history*/);
										break;
									case "ASSOCIATE":
										// this._oRouter.navTo("associateLogon", true/*replace history*/);
										this._oRouter.navTo("associateRedirect", {}, true/*replace history*/);
										break;
									default:
										this._oRouter.navTo("eula", {}, true/*replace history*/);
										break;
								}
							}
						});
					});
				}
			} else {
				this._oViewModel.setProperty("/showContacting", false);
				this._oRouter.navTo("eula", {}, true/*replace history*/);
			}
		},

		/**
		 * Check to see if a given date is in the past.
		 * @param {Date} dTestDate The date to be tested
		 * @returns {Boolean} True if the given date is in the past.
		 * @private
		 */
		_dateIsPast: function(dTestDate) {
			let bIsOkay = true;
			const dCurrnetDate = new Date(),
				iCurrentYear = dCurrnetDate.getFullYear(),
				iTestYear = dTestDate.getFullYear();

			if (iCurrentYear > iTestYear) {
				bIsOkay = false;
			} else {
				const iCurrentMonth = dCurrnetDate.getMonth(),
					iTestMonth = dTestDate.getMonth();
				if (iCurrentMonth > iTestMonth) {
					bIsOkay = false;
				} else {
					const iCurrentDay = dCurrnetDate.getDate(),
						iTestDay = dTestDate.getDate();
					if (iCurrentDay > iTestDay) {
						bIsOkay = false;
					}
				}
			}

			return bIsOkay;
		}

	});
});