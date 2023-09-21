PUBLIX_APP_CONFIG = {
    /** 
     * !!!!! FOR TESTING ONLY - REMOVE THE NEXT LINE BEFORE PRODUCTION BUILDS !!!!!
     */
SYSTEM: "DEV",


    /**
     * Local Storage ID (on device).
     */
    EULA_STATUS_ID: "PublixEulaStatus",

    /**
     * The Launchpad App that to redirect to after startup.
     */
    LAUNCHPAD: "/sap/bc/ui2/flp",

    /**
     * Turn on the 'local' logon page.  This will collect User ID & Password locally and send it
     * to the authentication provider via a POST call, to collect the auth token.
     */
    LOCAL_LOGON: false,

    /**
     * Publix Vendor URIs
     */
    VENDOR_URI_P: "https://fieldservices.publix.com",       // Production
    VENDOR_URI_Q: "https://fieldservices-stg.publix.com",   // Quality Assurance
    VENDOR_URI_D: "https://dsapgw20.publix.com:8020",       // Development

    /**
     * Publix Associate URIs
     */
    ASSOCIATE_URI_P: "https://flpassociateapps.publix.com",  // Production
    ASSOCIATE_URI_Q: "https://ssapaqa420.publix.com:60001",  // Quality Assurance
    ASSOCIATE_URI_D: "https://dsapadv420.publix.com:60001"   // Development
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