import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";

type OnGetDeviceInformationOptions = "doNothing" | "showPage" | "callMicroflow";

class MobileDevice extends WidgetBase {
    private deviceIDAttribute: string;
    private deviceTypeAttribute: string;
    private onGetDeviceInformationMicroflow: string;
    private onGetDeviceInformationOption: OnGetDeviceInformationOptions;
    private onGetDeviceInformationPage?: string;

    update(mxObject: mendix.lib.MxObject, callback: () => void) {
        const warnings = this.validateProps();
        if (warnings) {
            domConstruct.create("div", {
                class: "alert alert-danger",
                innerHTML: warnings
            }, this.domNode);
        } else {
            const type = window.device ? window.device.platform : "Web";
            const id = window.device ? window.device.uuid : "";

            this.setUpWidgetDom();
            mxObject.set(this.deviceIDAttribute, id);
            mxObject.set(this.deviceTypeAttribute, type);

            this.save(mxObject, (error, object) => {
                mx.ui.back();
                this.executeMicroFlow(mxObject);
            });
        }

        callback();
    }

    private setUpWidgetDom() {
        domConstruct.create("div", {
            class: "device-id-widget",
            id: "widget-device-id"
        }, document.body, "first");
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

    // tslint:disable-next-line:max-line-length
    private save(mxObject: mendix.lib.MxObject, callback: (error: mendix.lib.MxError | null, object?: mendix.lib.MxObject) => void) {
        window.mx.data.commit({
            callback: () => {
                callback(null, mxObject);
            },
            error: (error) => {
                window.mx.ui.error(`Error while saving device information: ${error.message}`),
                callback(error);
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
