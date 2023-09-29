sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/MessageBox"
], function(UIComponent, Device, JSONModel, ODataModel, MessageBox) {
	"use strict";

	return UIComponent.extend("com.publix.eula.Component", {
		oMsalInstance: null,
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
		 * Return the configuration setting for using the local launchpad page (or the redirect).
		 * @returns {Boolean} True if the local launchpad page is to be used.
		 * @public
		 */
		getUseLocalaunchpad: function() {
			return this.config.USE_LOCAL_LAUNCHPAD;
		},
		
		/**
		 * Return the configuration setting for using the local logon page (or the redirect).
		 * @returns {Boolean} True if the local logon page is to be used.
		 * @public
		 */
		getUseLocalLogon: function() {
			return this.config.USE_LOCAL_LOGON;
		},

		/**
		 * Return the URI for Publix Associate interactions.
		 * @returns {String} the URI for Publix Associate Logons.
		 * @public
		 */
		getAssociateUri: function() {
			return this.config.ASSOCIATE_URL;
		},

		/**
		 * Return the URI for Publix Vendor interactions.
		 * @returns {String} the URI for Publix Vendor Logons.
		 * @public
		 */
		getVendorUri: function() {
			return this.config.VENDOR_URL;
		},

		/**
		 * Return the URL for the Launchpad App configured for startup.
		 * @returns {String} The URI of the Launchpad App.
		 * @public
		 */
		getLaunchpadUri: function() {
			return this.getUseLocalaunchpad() ? this.config.LOCAL_LAUNCHPAD_URI : this.config.REMOTE_LAUNCHPAD_URI;
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

			if (this.config.ACTIVE_EULA) {
				let sStatus = window.localStorage.getItem(this.config.EULA_STATUS_ID);
				if (sStatus) {
					oEulaStatus = JSON.parse(sStatus);
					oEulaStatus.AcceptedOn = new Date(oEulaStatus.AcceptedOn);
				}
			}

/** THIS CODE IS FOR TESTING ONLY !!!!!!!! **/
// oEulaStatus ={
// 	UserId: "P1850771",
// 	UserType: "VENDOR",
// 	AcceptedOn: new Date(),
// 	Eula: {
// 		Version: "1.0",
// 		Title: "Test",
// 		Text: "BlaBlaBla"
// 	}
// };

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
				setTimeout(() => {
					window.location.href = sUrl; // Goto the (remote) startup page to get the logon token(s).
				}, 100);
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
			return this._msalInit();

			return new Promise((fnResolve, fnReject) => {

				const oUserModel = new JSONModel();
				const sStartupUri = sUrl + this.getLaunchpadUri();

				oUserModel.loadData(sStartupUri, {
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
		},



		/* ================================================== */
		/*  Microsoft Authentication Library (MSAL) methods   */
		/* ================================================== */

		/**
		 * 
		 */
		_msalInit: function() {
			return new Promise((fnResolve, fnReject) => {
				if (!this.config.MSAL.TENANT_ID) {	//} || !this.config.MSAL.CLIENT_ID) {
					const sErrorMessage = "The MSAL Tenant ID is missing and is required for authentication!";
					fnReject(new Error(sErrorMessage));
				}

				this._msalLogin(this._getMsalInstance()).then(oResult => {
					// TODO - convert to sap logger.
					console.log(oResult);
					fnResolve(oResult);
				});
			});
		},

		/**
		 * 
		 */
		_msalLogin: async function(oMsal) {
			let oRedirect = await oMsal.handleRedirectPromise();
			if (oRedirect) {
				// TODO - convert to sap logger.
				console.log('MSAL handleRedirectPromise result wihout redirect');
				return oRedirect;
			} else {
				const sInterceptedUrl = await new Promise(fnResolve => {
					oMsal.setNavigationClient(new CustomNavigationClient(this._getInAppBrowserOptions(), fnResolve));
					oMsal.loginRedirect().catch(oError => {
						// TODO - convert to sap logger.
						console.log(oError);
					});
				});
				return sInterceptedUrl ? oMsal.handleRedirectPromise(new URL(sInterceptedUrl).hash) : null;
			}
		},

		/**
		 * 
		 */
		_getMsalInstance: function() {
			if (!this.oMsalInstance) {
		
				this.oMsalInstance = new msal.PublicClientApplication({
					auth: {
						protocolMode: 'OIDC',
						clientId: this.config.MSAL.CLIENT_ID,
						authority: `https://login.microsoftonline.com/${this.config.MSAL.TENANT_ID}`,
						// redirectUri: 'http://localhost:3000' // Enter this as a redirect URI in the Azure application Authentication page.
						redirectUri: this.getAssociateUri() + "/sap/opu/odata/sap/ZFIORI_PUBLIX_EULA_SRV/"
					},
					cache: {
						cacheLocation: 'localStorage'
					},
					system: {
						loggerOptions: {
							loggerCallback(_, sMessage) {
								// TODO - convert to sap logger.
								console.log('MSAL.js: ' + sMessage);
							},
							piiLoggingEnabled: false,
							logLevel: msal.LogLevel.Verbose,
						}
					}
				});
			}

			return this.oMsalInstance;
		},

		/**
		 * 
		 */
		_getInAppBrowserOptions: function (oOptions = {}) {
			// Plugin @Capacitor/Browser 'options' documentation:
			// https://capacitorjs.com/docs/apis/browser#openoptions
			return Object.entries({
				url: "",
				windowName: "_blank",
				toolbarcolor: "#ffffff",
				presentationStyle: "popover", //"fullscreen"
				width: "auto",
				height: "auto"
			}).map(([k, v]) => {`${k}=${v}`}).join(',');
		},

		/**
		 *	Plugin @Capacitor/Browser documentation:
		 *	https://capacitorjs.com/docs/apis/browser
		 * 
		 * @param {Strin} sUrl The URL for the Publix Authentication (MSAL) logon page.
		 * @returns {Promise} A javascript Promise that is resolved when the in-app-browser closes.
		 */
		_navigateToLogonPage: function (sUrl,) {
			return new Promise((fnResolve, fnReject) => {
				if (!window.Capacitor.Browser) {
					fnReject(new Error("In-App-Browser has not been installed!"));
				}
		
				// Generate a Map of constructor 'options'
				let mOptions = Object.entries({
					url: sUrl,
					windowName: "_blank",
					toolbarcolor: "#ffffff",
					presentationStyle: "popover", //"fullscreen"
					width: "auto",
					height: "auto"
				}).map(([k, v]) => {`${k}=${v}`}).join(',');

				window.Capacitor.Browser.open(mOptions).then((oBrowser) => {
					oBrowser.removeAllListeners().then(() => {
						oBrowser.addListener("browserFinished", (oResult) => {
							fnResolve(oResult);
						});
					});
				}).catch(oError => {
					fnReject(oError);
				});
			});	
		}

	});

});



/* ====================================================== */
/*  In-App-Browser Class implementation (for MSAL login)  */
/* ====================================================== */

class CustomNavigationClient {
  
    constructor(fnResolve) {
		if (!window.Capacitor.Browser) {
			throw new Error("In-App-Browser has not been installed!");
		}
    
        this.fnResolve = fnResolve;
		window.Capacitor.Browser.removeAllListeners().then(() => {
			window.Capacitor.Browser.addListener("browserFinished", (oResult) => {
				this.fnResolve(oResult);
			});
		});
	}

    navigateExternal(sUrl, options) {
		// Generate a Map of constructor 'options'
		const mOptions = Object.entries({
			url: sUrl,
			windowName: "_blank",
			toolbarcolor: "#ffffff",
			presentationStyle: "popover", //"fullscreen"
			width: "auto",
			height: "auto"
		}).map(([k, v]) => {`${k}=${v}`}).join(',');

		window.Capacitor.Browser.open(mOptions).then(() => {
			// Nothing to do here but wait for the 'browserFinished' event (bound in the constructor).
		}).catch(oError => {
			// TODO - add sap logger entry.
			throw oError;
		});

		return true;
    }
  
}