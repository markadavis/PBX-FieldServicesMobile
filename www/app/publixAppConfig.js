PUBLIX_APP_CONFIG = {
    /**
     * Local Storage ID (on device).
     */
    EULA_STATUS_ID: "PublixEulaStatus",

    /**
     * The Launchpad App that to redirect to after startup.
     */
    LAUNCHPAD: "/sap/bc/ui2/flp",

    /**
     * Publix Vendor URIs
     */
    VENDOR_URI_P: "https://fieldservices.publix.com",       // Production
    VENDOR_URI_Q: "https://fieldservices-stg.publix.com",   // Quality Assurance
    VENDOR_URI_D: "https://dsapgw20.publix.com:60000",      // Development

    /**
     * Publix Associate URIs
     */
    ASSOCIATE_URI_P: "https://dsapadv421.publix.com:8021",  // Production
    ASSOCIATE_URI_Q: "https://dsapadv421.publix.com:8021",  // Quality Assurance
    ASSOCIATE_URI_D: "https://dsapadv421.publix.com:8020"   // Development
}


/**
 * Runtime reconfiguration of the Backend URI (for dev/qa/prod selection).
 */
if (PUBLIX_APP_CONFIG.SYSTEM) {
    PUBLIX_APP_CONFIG.VENDOR_URI = PUBLIX_APP_CONFIG["VENDOR_URI_" + PUBLIX_APP_CONFIG.SYSTEM.charAt(0)];
    PUBLIX_APP_CONFIG. ASSOCIATE_URI= PUBLIX_APP_CONFIG["ASSOCIATE_URI_" + PUBLIX_APP_CONFIG.SYSTEM.charAt(0)];
} else {
    // User Production URIs
    PUBLIX_APP_CONFIG.VENDOR_URI = PUBLIX_APP_CONFIG.VENDOR_URI_P;
    PUBLIX_APP_CONFIG.ASSOCIATE_URI = PUBLIX_APP_CONFIG.ASSOCIATE_URI_P
}