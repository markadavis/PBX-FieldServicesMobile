[![Publis Repository Guidance](./img/pbxRepoGuidance.png)](https://readthedocs.publix.com/articles/azure-devops/code-management/RepositoryGuidance.html) [![Build iOS App](./img/buildAppleAppStore.png)](./BUILD_IOS.md) [![Build Android App](./img/buildGooglePlayStore.png)](./BUILD_ANDROID.md)

# Application *com.publix.erpmobile*

This repository is for the Publix SAP ERP Mobile application.  Currently only being used by the Logistics/Plant Maintenace application area, specifically for the "Field Service Technicians".  Plans to implement additional applets (aka Fiori apps) on this platform remains an on-going discussion.

The SAPUI5 libraries used by the deployed application are not stored in this repository.  You will have to download the appropriate version and add it to the project prior to development, build & deployment to the various app stores ([Refer to the installed version here](./www/js/resources/sap-ui-version.json)).

### Getting Started
1.	Installation process:
    - Open a terminal session in [Visual Studio Code](https://code.visualstudio.com/) and change the directory to the location that houses your cloned reposities (your working directory).
        - `> cd ~/my/repos`
    - Clone the repository:
        - `> git clone `[https://...com.publix.erpmobile](https://dev.azure.com/publix-corp/S0SAPSYS-SAP/_git/com.publix.ui5library)
    - If you have not already installed the Capacitor CLI, run the npm scripts to get it installed:
        - `> npm install -g @capacitor/core`
        - `> npm install -g @capacitor/cli`
    - If the 2 supported mobile platforms (iOS & Android) are not installed, use npm to install them:
        - `> npm install @capacitor/ios`
        - `> npx cap add ios`
        - `> npm install @capacitor/android`
        - `> npx cap add android`
    - Run the npm script to install the develelopment dependencies & build the app artifacts (for all platforms):
        - `> npm install`
        - `> npx vite build`
    - The install scripts will take some time to complete, so be patient.  There is a "post install" scripted defined in the package.json that will install the Micorosoft Authentication Library (MSAL). The Platforms referenced in the package.json will also ge installed:
        - Browser  (for dev simulation & testing)
        - iOS
        - Android
    - After npm completes, you will need to pull in the SAPUI5 libraries.  We don't store these in the Git repository as it is too large and can change based on the SAPUI5 version release.  To add the SAPUI5 libraries into the project, you will have to download them from the CDN and add them to the [`/www/js/resources`](./www/js/resources/) directory:
        - [Download SAPUI5 version 1.84.37](https://tools.hana.ondemand.com/additional/sapui5-rt-1.84.37.zip)
        - Currently you will only need to add the libraries for `sap.m` and `sap.ui`, so only add the files from the following directories:
            + /resources/*
                + /sap
                    + m/*
                    + ui/*

2.	Software dependencies
    - [Android Studio](https://developer.android.com/studio)
    - [Xcode](https://developer.apple.com/xcode/)
    - [Node.js & npm](https://nodejs.org/en/about) 
    - [Ionic Capacitor](https://capacitorjs.com/)
    - [SAPUI5](https://sapui5.hana.ondemand.com)

3.	Latest releases
    - Mobile App version 2.0.0
    - Ionic Capacitor version 10.1.0<br>Plugins: 
        - Camera v5.0.7  (@capacitor/camera)
        - Device v5.0.6  (@capacitor/device)
        - Geo-Location v5.0.6  (@capacitor/geolocation)
    - SAPUI5 version 1.84.37

4.	API references
    - [Ionic Capacitor](https://capacitorjs.com/docs)
    - [SAPUI5 version maintenance status](https://sapui5.hana.ondemand.com/versionoverview.html)
    - [SAPUI5 tools](https://tools.hana.ondemand.com#sapui5)
    - [SAPUI5 v1.8.37 API Documentation](https://sapui5.hana.ondemand.com/1.84.37)

### Build and Test
1.  To test the app in the browser; Run the npm script (uses the Cordova Shell):
    - `> npm run start`

2.  To build the app you will have to run the build script before using the corresponding apps IDE:
    - `> npm run build`
        - iOS: Refer the the [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios) for a complete list of build instructions.
        - Android: Refer the the [Capacitor Android Documentation](https://capacitorjs.com/docs/android) for a complete list of build instructions.

### Contribute
- [Inspect branches](https://dev.azure.com/publix-corp/S0SAPSYS-SAP/_git/com.publix.ui5library/branches?_a=all)
- [Inspect pull Requests](https://dev.azure.com/publix-corp/S0SAPSYS-SAP/_git/com.publix.ui5library/pullrequests?_a=completed)
- [Submit bugs](https://dev.azure.com/publix-corp/S0SAPSYS-SAP/S0SAPSYS-SAP%20Logistics%20Team/_workitems/create/bug)


### notes
>*If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en1-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration by checking out the [Visual Studio Code](https://github.com/microsoft/vscode/blob/main/README.md) readme file.*
