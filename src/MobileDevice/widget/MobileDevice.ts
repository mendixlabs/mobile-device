import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoLang from "dojo/_base/lang";
import * as dojoOn from "dojo/on";

type onDeviceReadyActions = "doNothing" | "showPage" | "callMicroflow";

class MobileDevice extends WidgetBase {
    deviceIdAttribute: string;
    deviceTypeAttribute: string;
    appVersionVersionAttribute: string;
    appVersionNameAttribute: string;
    appVersionIdAttribute: string;
    microflow: string;
    onDeviceReadyAction: onDeviceReadyActions;
    page: string;
    onNavigateBack: boolean;
    // internal variables
    private deviceReadyEvent: dojoEvent | null;
    private mxObject: mendix.lib.MxObject;

    postCreate() {
        this.showError(this.validateProps());
        this.setUpWidgetDom();
    }

    update(mxObject: mendix.lib.MxObject, callback?: () => void) {
        this.mxObject = mxObject;
        this.setDeviceInformation();
        this.getWebDeviceInformation();
        this.setUpEvents();

        if (callback) {
            callback();
        }
    }

    uninitialize(): boolean {
        this.removeEvents();

        return true;
    }

    private showError(message: string) {
        if (message) {
            domConstruct.create("div", {
                class: "alert alert-danger",
                innerHTML: message
            }, this.domNode);
        }
    }

    private setUpEvents() {
        if (window.device) {
            this.deviceReadyEvent = dojoOn(document, "deviceReady", dojoLang.hitch(this, this.onDeviceReady));
        }
    }

    private removeEvents() {
        if (window.device && this.deviceReadyEvent) {
            this.deviceReadyEvent.remove();
            this.deviceReadyEvent = null;
        }
    }

    private setUpWidgetDom() {
        domConstruct.create("div", {
            class: "mobile-device-widget",
            id: "mobile-device"
        }, this.domNode, "first");
    }

    private onDeviceReady() {
        this.getAppInformation();
    }

    private validateProps(): string {
        let errorMessage = "";
        if (this.onDeviceReadyAction === "callMicroflow" && !this.microflow) {
            errorMessage = "on click microflow is required in the 'Events' tab, 'Microflow' property";
        } else if (this.onDeviceReadyAction === "showPage" && !this.page) {
            errorMessage = "on click page is required in the 'Events' tab, 'Page' property";
        }

        return errorMessage && `Error in mobile device widget configuration: ${errorMessage}`;
    }

    private setDeviceInformation() {
        if (this.deviceTypeAttribute) {
            this.mxObject.set(this.deviceTypeAttribute, window.device ? window.device.platform : "Web");
        }
        if (this.deviceIdAttribute) {
            this.mxObject.set(this.deviceIdAttribute, window.device ? window.device.uuid : "");
        }
    }

    private getWebDeviceInformation() {
        if (!window.device) {
            if (this.onNavigateBack) {
                mx.ui.back();
            }
            this.executeMicroFlow(this.mxObject);
        }
    }

    private getAppInformation() {
        if (this.appVersionNameAttribute || this.appVersionIdAttribute || this.appVersionVersionAttribute) {
            if (cordova.hasOwnProperty("getAppVersion")) {
                cordova.getAppVersion.getAppName(appName => {
                    if (this.appVersionNameAttribute) {
                        this.mxObject.set(this.appVersionNameAttribute, appName);
                    }
                    cordova.getAppVersion.getPackageName(packageName => {
                        if (this.appVersionIdAttribute) {
                            this.mxObject.set(this.appVersionIdAttribute, packageName);
                        }
                        cordova.getAppVersion.getVersionNumber(versionNumber => {
                            if (this.appVersionVersionAttribute) {
                                this.mxObject.set(this.appVersionVersionAttribute, versionNumber);
                            }
                            if (this.onNavigateBack) {
                                mx.ui.back();
                            }
                            this.executeMicroFlow(this.mxObject);
                        });
                    });
                });
            } else {
                window.mx.ui.error("Mobile device widget: add cordova-plugin-app-version to your project config");
            }
        }
    }

    private executeMicroFlow(mxObject: mendix.lib.MxObject) {
        const context = this.mxcontext;
        context.setContext(mxObject.getEntity(), mxObject.getGuid());
        if (!mxObject || !mxObject.getGuid()) {
            return;
        }
        if (this.onDeviceReadyAction === "callMicroflow" && this.microflow) {
            window.mx.ui.action(this.microflow, {
                context,
                error: error =>
                    window.mx.ui.error(`Error while executing microflow ${this.microflow}: ${error.message}`),
                origin: this.mxform
            });
        } else if (this.microflow === "showPage" && this.page) {
            window.mx.ui.openForm(this.page, {
                context,
                error: error =>
                    window.mx.ui.error(`Error while opening page ${this.page}: ${error.message}`)
            });
        }
    }
}
// tslint:disable : only-arrow-functions
dojoDeclare("MobileDevice.widget.MobileDevice", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const property in Source.prototype) {
        if (property !== "constructor" && Source.prototype.hasOwnProperty(property)) {
            result[property] = Source.prototype[property];
        }
    }
    return result;
}(MobileDevice));
