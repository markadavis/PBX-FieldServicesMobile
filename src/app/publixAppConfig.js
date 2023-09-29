PUBLIX_APP_CONFIG = {
    /** 
     * !!!!! FOR TESTING ONLY - REMOVE THE NEXT LINE BEFORE PRODUCTION BUILDS !!!!!
     */
    SYSTEM: "Development",


    /**
     * Microsoft Authentication Library (MSAL) CONFIG 
     */
    MSAL: {
        CLIENT_ID: "",
        TENANT_ID: "623cac68-b5d0-45f1-9109-3122c3974cc9"
    },


    /**
     * Local Storage ID (on device).
     */
    EULA_STATUS_ID: "PublixEulaStatus",


    /**
     * Turn on the 'local' logon page.  This will collect User ID & Password locally and send it
     * to the authentication provider via a POST call, to collect the auth token.
     */
    USE_LOCAL_LAUNCHPAD: false,
    LOCAL_LAUNCHPAD_URI: "/app/launchpad",
    REMOTE_LAUNCHPAD_URI: "/sap/bc/ui2/flp",
    

    /**
     * Turn on the End User License Agreement (EULA) page.  This will force the user to accept
     * the EULA before starting the Launchpad.
     */
    ACTIVE_EULA: true,


    /**
     * Turn on the 'local' logon page.  This will collect User ID & Password locally and send it
     * to the authentication provider via a POST call, to collect the auth token.
     */
    USE_LOCAL_LOGON: true,

    /**
     * Publix External (Vendor) URLs
     */
    VENDOR_URL_P: "https://fieldservices.publix.com",       // Production
    VENDOR_URL_Q: "https://fieldservices-stg.publix.com",   // Quality Assurance
    VENDOR_URL_D: "https://dsapgw20.publix.com:8020",       // Development

    /**
     * Publix Internal (Associate) URLs
     */
    ASSOCIATE_URL_P: "https://flpassociateapps.publix.com",  // Production
    ASSOCIATE_URL_Q: "https://ssapaqa420.publix.com:60001",  // Quality Assurance
    ASSOCIATE_URL_D: "https://dsapadv420.publix.com:60001"   // Development
}


/**
 * Runtime setting of the Backend URL (for dev/qa/prod selection).
 */
if (PUBLIX_APP_CONFIG.SYSTEM) {
    PUBLIX_APP_CONFIG.VENDOR_URL = PUBLIX_APP_CONFIG["VENDOR_URL_" + PUBLIX_APP_CONFIG.SYSTEM.charAt(0).toUpperCase()];
    PUBLIX_APP_CONFIG.ASSOCIATE_URL= PUBLIX_APP_CONFIG["ASSOCIATE_URL_" + PUBLIX_APP_CONFIG.SYSTEM.charAt(0).toUpperCase()];
} else {
    // User Production URLs
    PUBLIX_APP_CONFIG.VENDOR_URL = PUBLIX_APP_CONFIG.VENDOR_URL_P;
    PUBLIX_APP_CONFIG.ASSOCIATE_URL = PUBLIX_APP_CONFIG.ASSOCIATE_URL_P
}