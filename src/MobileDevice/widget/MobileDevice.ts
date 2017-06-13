import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoLang from "dojo/_base/lang";

type OnGetDeviceInformationOptions = "doNothing" | "showPage" | "callMicroflow";

class MobileDevice extends WidgetBase {
    private deviceIDAttribute: string;
    private deviceTypeAttribute: string;
    private appVersionVersionAttribute: string;
    private appVersionBuildAttribute: string;
    private onGetDeviceInformationMicroflow: string;
    private onGetDeviceInformationOption: OnGetDeviceInformationOptions;
    private onGetDeviceInformationPage?: string;
    private mxObject: mendix.lib.MxObject;

    update(mxObject: mendix.lib.MxObject, callback: () => void) {
        this.mxObject = mxObject;
        const warnings = this.validateProps();
        if (warnings) {
            domConstruct.create("div", {
                class: "alert alert-danger",
                innerHTML: warnings
            }, this.domNode);
        } else {
            this.setUpWidgetDom();
            this.connect(document, "deviceReady", dojoLang.hitch(this, this.onDeviceReady));
            if (!window.device) {
                mxObject.set(this.deviceIDAttribute, "");
                mxObject.set(this.deviceTypeAttribute, "Web");
                this.save(mxObject);
            }
        }

        callback();
    }

    uninitialize(): boolean {
        window.removeEventListener("deviceReady", this.onDeviceReady);
        return true;
    }

    private setUpWidgetDom() {
        domConstruct.create("div", {
            class: "mobile-device-widget",
            id: "mobile-device"
        }, document.body, "first");
    }

    private onDeviceReady() {
        if (cordova.getAppVersion !== undefined) {
            cordova.getAppVersion.getVersionNumber((versionNumber: number) => {
                if (versionNumber) {
                    cordova.getAppVersion.getVersionCode((versionCode: string) => {
                        if (versionCode) {
                            this.mxObject.set(this.deviceIDAttribute, window.device.uuid);
                            this.mxObject.set(this.deviceTypeAttribute, window.device.platform);
                            this.mxObject.set(this.appVersionBuildAttribute, versionNumber);
                            this.mxObject.set(this.appVersionVersionAttribute, versionCode);
                            this.save(this.mxObject);
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
        if (this.onGetDeviceInformationOption === "callMicroflow" && !this.onGetDeviceInformationMicroflow) {
            errorMessage = "on click microflow is required in the 'Events' tab, 'Microflow' property";
        } else if (this.onGetDeviceInformationOption === "showPage" && !this.onGetDeviceInformationPage) {
            errorMessage = "on click page is required in the 'Events' tab, 'Page' property";
        }

        return errorMessage && `Error in device id widget configuration: ${errorMessage}`;
    }

    private save(mxObject: mendix.lib.MxObject) {
        window.mx.data.commit({
            callback: () => {
                mx.ui.back();
                this.executeMicroFlow(mxObject);
            },
            error: (error) => {
                window.mx.ui.error(`Error while saving device information: ${error.message}`);
            },
            mxobj: mxObject
        });
    }

    private executeMicroFlow(mxObject: mendix.lib.MxObject) {
        const context = new window.mendix.lib.MxContext();
        context.setContext(mxObject.getEntity(), mxObject.getGuid());
        if (!mxObject || !mxObject.getGuid()) {
            return;
        }
        if (this.onGetDeviceInformationOption === "callMicroflow" && this.onGetDeviceInformationMicroflow) {
            const getError = (error: Error) => ` ${this.onGetDeviceInformationMicroflow}: ${error.message}`;
            window.mx.ui.action(this.onGetDeviceInformationMicroflow, {
                context,
                error: error => window.mx.ui.error(`Error while executing microflow ${getError(error)}`),
                origin: this.mxform
            });
        } else if (this.onGetDeviceInformationMicroflow === "showPage" && this.onGetDeviceInformationPage) {
            window.mx.ui.openForm(this.onGetDeviceInformationPage, {
                context,
                error: error =>
                    window.mx.ui.error(`Error while opening page ${this.onGetDeviceInformationPage}: ${error.message}`)
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
