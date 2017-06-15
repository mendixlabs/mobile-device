import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoLang from "dojo/_base/lang";
import * as dojoOn from "dojo/on";

type onDeviceReadyActions = "doNothing" | "showPage" | "callMicroflow";

class MobileDevice extends WidgetBase {
    private deviceIdAttribute: string;
    private deviceTypeAttribute: string;
    private appVersionVersionAttribute: string;
    private appVersionBuildAttribute: string;
    private microflow: string;
    private onDeviceReadyAction: onDeviceReadyActions;
    private page: string;
    private mxObject: mendix.lib.MxObject;
    private onNavigateBack: boolean;
    // internal variables
    private deviceReadyEvent: any;

    postCreate() {
        this.showError(this.validateProps());
        this.setUpWidgetDom();
        this.setUpEvents();
    }

    update(mxObject: mendix.lib.MxObject, callback: () => void) {
        this.mxObject = mxObject;
        if (!window.device) {
            mxObject.set(this.deviceIdAttribute, "");
            mxObject.set(this.deviceTypeAttribute, "Web");
            this.commit(mxObject);
        }

        callback();
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
        if (window.device) {
            if (this.deviceReadyEvent) {
                this.deviceReadyEvent.remove();
                this.deviceReadyEvent = null;
            }
        }
    }

    private setUpWidgetDom() {
        domConstruct.create("div", {
            class: "mobile-device-widget",
            id: "mobile-device"
        }, document.body, "first");
    }

    private onDeviceReady() {
        if (cordova.getAppVersion !== undefined) {
            cordova.getAppVersion.getVersionNumber((versionNumber: string) => {
                if (versionNumber) {
                    cordova.getAppVersion.getVersionCode((versionCode: string) => {
                        if (versionCode) {
                            this.mxObject.set(this.deviceIdAttribute, window.device.uuid);
                            this.mxObject.set(this.deviceTypeAttribute, window.device.platform);
                            this.mxObject.set(this.appVersionBuildAttribute, versionNumber);
                            this.mxObject.set(this.appVersionVersionAttribute, versionCode);
                            this.commit(this.mxObject);
                        }
                    });
                }
            });
        } else {
            window.mx.ui.error("Add cordova-plugin-app-version to your project config");
        }
    }

    private validateProps(): string {
        let errorMessage = "";
        if (this.onDeviceReadyAction === "callMicroflow" && !this.microflow) {
            errorMessage = "on click microflow is required in the 'Events' tab, 'Microflow' property";
        } else if (this.onDeviceReadyAction === "showPage" && !this.page) {
            errorMessage = "on click page is required in the 'Events' tab, 'Page' property";
        }

        return errorMessage && `Error in device id widget configuration: ${errorMessage}`;
    }

    private commit(mxObject: mendix.lib.MxObject) {
        window.mx.data.commit({
            callback: () => {
                if (this.onNavigateBack) {
                    mx.ui.back();
                }
                this.executeMicroFlow(mxObject);
            },
            error: (error) => window.mx.ui.error(`Error while saving device information: ${error.message}`),
            mxobj: mxObject
        });
    }

    private executeMicroFlow(mxObject: mendix.lib.MxObject) {
        const context = this.mxcontext;
        context.setContext(mxObject.getEntity(), mxObject.getGuid());
        if (!mxObject || !mxObject.getGuid()) {
            return;
        }
        if (this.onDeviceReadyAction === "callMicroflow" && this.microflow) {
            const getError = (error: Error) => ` ${this.microflow}: ${error.message}`;
            window.mx.ui.action(this.microflow, {
                context,
                error: error => window.mx.ui.error(`Error while executing microflow ${getError(error)}`),
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
