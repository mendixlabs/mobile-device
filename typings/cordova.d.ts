type callbackFunction = (something: (versionNumber: string) => void) => string;

interface Cordova {
    getAppVersion: {
        getVersionNumber: callbackFunction ;
        getAppName: callbackFunction;
        getPackageName: callbackFunction;
    };
}
declare const cordova: Cordova;
