sap.ui.define([
	"sap/base/util/ObjectPath",
	"sap/ushell/services/Container"
], function (ObjectPath) {
	"use strict";

	// Define ushell config (aka Launchpad)
	ObjectPath.set(["sap-ushell-config"], {
		defaultRenderer: "fiori3",
		bootstrapPlugins: {
			"RuntimeAuthoringPlugin": {
				component: "sap.ushell.plugins.rta",
				config: {
					validateAppVersion: false
				}
			},
			"PersonalizePlugin": {
				component: "sap.ushell.plugins.rta-personalize",
				config: {
					validateAppVersion: false
				}
			}
		},
		renderers: {
			fiori3: {
				componentData: {
					config: {
						enableSearch: false,
						rootIntent: "compublixerpmobile-display"
					}
				}
			}
		},
		services: {
			"LaunchPage": {
				"adapter": {
					"config": {
						"groups": [{
							"tiles": [
								{
									"tileType": "sap.ushell.ui.tile.StaticTile",
									"properties": {
										"title": "App Launcher",
										"targetURL": "#compublixerpmobile-display"
									}
								}, {
									"tileType": "sap.ushell.ui.tile.StaticTile",
									"properties": {
										"title": "Service Technician",
										"targetURL": "#compublixfstech-display"
									}
								}
							]
						}]
					}
				}
			},
			"ClientSideTargetResolution": {
				"adapter": {
					"config": {
						"inbounds": {
							"compublixerpmobile-display": {
								"semanticObject": "compublixerpmobile",
								"action": "display",
								"description": "Publix ERP Mobile App Launchpad",
								"title": "App Launcher",
								"signature": {
									"parameters": {}
								},
								"resolutionResult": {
									"applicationType": "SAPUI5",
									"additionalInformation": "SAPUI5.Component=com.publix.erpmobile",
									"url": sap.ui.require.toUrl("com/publix/erpmobile")
								}
							}
						}
					}
				}
			},
			NavTargetResolution: {
				config: {
					"enableClientSideTargetResolution": true
				}
			}
		}
	});

	var oLaunchpad  = {
        /**
         * Initializes the Launchpad
         * @returns {Promise} A promise that is resolved when the Launchpad has been bootstraped.
         */
        init: function () {
			// The Launchpad is a singleton, so we can start it only once!
			if (!this._oBootstrapFinished) {
				this._oBootstrapFinished = sap.ushell.bootstrap("local");   // Returns a Promise
				this._oBootstrapFinished.then(() => {
					sap.ushell.Container.createRenderer().placeAt("content");
				});
			}

			return this._oBootstrapFinished;
		}
	};

    return oLaunchpad;
});