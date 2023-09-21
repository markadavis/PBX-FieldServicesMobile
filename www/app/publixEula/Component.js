sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/MessageBox"
], function(UIComponent, Device, JSONModel, ODataModel, MessageBox) {
	"use strict";

	return UIComponent.extend("com.publix.eula.Component", {
		config: PUBLIX_APP_CONFIG,	// from www/app/publixAppConfig.js

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			this._oRouter = this.getRouter();

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// Bind the text resource bundle (i18n).
			this._oResourceBundle = this.getModel("i18n").getResourceBundle();

			// Set the device model.
			const oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			this.setModel(oModel, "device");
		},



		/* ================================================== */
		/*  Public Methods                                    */
		/* ================================================== */

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		/**
		 * Return the configuration setting for using the local logon page (or the redirect).
		 * @returns {Boolean} True if the local logon page is to be used.
		 * @public
		 */
		getUseLocalLogon: function() {
			return this.config.LOCAL_LOGON;
		},

		/**
		 * Return the URI for Publix Associate interactions.
		 * @returns {String} the URI for Publix Associate Logons.
		 * @public
		 */
		getAssociateUri: function() {
			return this.config.ASSOCIATE_URI;
		},

		/**
		 * Return the URI for Publix Vendor interactions.
		 * @returns {String} the URI for Publix Vendor Logons.
		 * @public
		 */
		getVendorUri: function() {
			return this.config.VENDOR_URI;
		},

		/**
		 * Return the URL for the Launchpad App configured for startup.
		 * @returns {String} The URI of the Launchpad App.
		 * @public
		 */
		getLaunchpadUri: function() {
			return this.config.LAUNCHPAD;
		},

		/**
		 * Get the locally stored values for the Users acceptance of the End User License Agreement (EULA).
		 * @param {String} sUserId The User ID used to accept the EULA.
		 * @returns {Object} The User Status object from 'local storage'.
		 * @public
		 */
		getEulaStatus: function(sUserId) {
			let oEulaStatus = {
				UserId: "",
				UserType: "",
				AcceptedOn: null,
				Eula: {
					Version: "1",
					Title: "",
					Text: ""
				}
			};

			let sStatus = window.localStorage.getItem(this.config.EULA_STATUS_ID);
			if (sStatus) {
				oEulaStatus = JSON.parse(sStatus);
				oEulaStatus.AcceptedOn = new Date(oEulaStatus.AcceptedOn);
			}

			return oEulaStatus;
		},

		/**
		 * Set the (webkit) 'local storage' object for the Users Accemptance of the EULA.
		 * @param {Object} oEulaStatus The EULA Status object to be placed into 'local storage'.
		 *	{
		 *		UserId: "",
		 *		UserType: "",
		 *		AcceptedOn: Date(),
		 *		Eula: {
		 *			Version: "",
		 *			Title: "",
		 *			Text: ""
		 *		}
		 *	}
		 * @public
		 */
		setEulaStatus: function(oEulaStatus) {
			if (oEulaStatus) {
				const sStatus = JSON.stringify(oEulaStatus);
				window.localStorage.setItem(this.config.EULA_STATUS_ID, sStatus);
			} else {
				window.localStorage.removeItem(this.config.EULA_STATUS_ID);
			}
		},

		/**
		 * Log the user onto the Publix Associate service producer.
		 * @returns {Promise} A Promise object that resolves when the User successfully autenticates.
		 * @public
		 */
		associateLogon() {
			return new Promise((fnResolve, fnReject) => {
				this._startup(this.getAssociateUri())
				.then(oEulaStatus => {
					// TODO - check the EULA versions & send to EULA page if not the same.
					oEulaStatus.UserType = "ASSOCIATE";
					this.setEulaStatus(oEulaStatus);
					fnResolve(oEulaStatus);
				})
				.catch(oError => {
					fnReject(oError);
				});
			});
		},
		
		/**
		 * Log the user onto the Vendor service producer.
		 * @returns {Promise} A Promise object that resolves when the User successfully autenticates.
		 * @public
		 */
		vendorLogon() {
			return new Promise((fnResolve, fnReject) => {
				this._startup(this.getVendorUri())
				.then(oEulaStatus => {
					// TODO - check the EULA versions & send to EULA page if not the same.
					oEulaStatus.Usertype = "VENDOR";
					this.setEulaStatus(oEulaStatus);
					fnResolve(oEulaStatus);
				})
				.catch(oError => {
					fnReject(oError);
				});
			});
		},

		/**
		 * Start the SAP Fiori Launchpad from the backend server.
		 * @public
		 */
		startLaunchpad: function() {
			const oEulaStatus = this.getEulaStatus();
			const sLaunchpad = this.getLaunchpadUri();

			let sUrl = ""
			switch (oEulaStatus.UserType) {
				case "VENDOR":
					sUrl = this.getVendorUri() + sLaunchpad;
					break;
				case "ASSOCIATE":
					sUrl = this.getAssociateUri() + sLaunchpad;
					break;
			}

			if (sUrl) {
				window.location.replace(sUrl);
			} else {
				// TODO - Throw an error here.
				this._oRouter.navTo("eula", {}, true/*replace history*/);
			}

		},



		/* ================================================== */
		/*  Private Methods                                   */
		/* ================================================== */

		/**
		 * Resolve a JS Promise after the user successfully establishes communication with the backend service producer.
		 * The authentication into the Publix domain will need to be negotiated in the first call.
		 * If the users fails to authenticate into the service producer, JS Promise will 'reject'.
		 * @param {String} sUrl The URL prefix of the service provider.
		 * @returns {Promise} A Promise object that resolves when the User successfully autenticates.
		 * @private
		 */
		_startup: function(sUrl) {
			return new Promise((fnResolve, fnReject) => {

				/** THIS CODE IS FOR TESTING ONLY !!!!!!!! **/
				// this.setEulaStatus({
				// 	UserId: "P1850771",
				// 	UserType: "VENDOR",
				// 	AcceptedOn: new Date(),
				// 	Eula: {
				// 		Version: "1.0",
				// 		Title: "Test",
				// 		Text: "BlaBlaBla"
				// 	}
				// });
				// fnResolve(this.getEulaStatus());

				const oUserModel = new JSONModel();
				oUserModel.loadData(sUrl + "/sap/bc/ui2/start_up", {
					bAsync: true
				}).then(oResponse => {
					this.setModel(oUserModel, "user");

					const oDataModel = new ODataModel({
						serviceUrl: sUrl + "/sap/opu/odata/sap/ZFIORI_PUBLIX_EULA_SRV/"
					});

					oDataModel.metadataLoaded().then(() => {
						const sPath = oDataModel.createKey("/EulaSet", {
							UserId: oUserModel.getProperty("/id")
						});

						const dDateAccepted = new Date();
						oDataModel.update(sPath, { dDateAccepted }, {
							success: oData => {

								// Retrieve the persisted EULA.
								oDataModel.read(sPath, {
									success: oResponse => {
										fnResolve(oResponse);
									},
									error: oError => {
										fnReject(oError);
									}
								});
							},
							error: oError => {
								fnReject(oError);
							}
						});
					});
	
				}).catch(oError => {
					fnReject(oError);
				});
			});
		}

	});
});