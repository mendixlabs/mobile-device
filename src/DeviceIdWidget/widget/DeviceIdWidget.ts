import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";

type OnGetDeviceInformationOptions = "doNothing" | "showPage" | "callMicroflow";
type onGetDeviceInformationFallback = "Android" | "IOS" | "Web";

class DeviceIdWidget extends WidgetBase {
    private deviceEntity: string;
    private deviceIDAttribute: string;
    private deviceTypeAttribute: string;
    private onGetDeviceInformationMicroflow: string;
    private onGetDeviceInformationOption: OnGetDeviceInformationOptions;
    private onGetDeviceInformationFallback: onGetDeviceInformationFallback;
    private onGetDeviceInformationPage?: string;
    private tokenAttribute: string;

    update(mxObject: mendix.lib.MxObject, callback: () => void) {
        const warnings = this.validateProps();
        if (warnings) {
            domConstruct.create("div", {
                class: "alert alert-danger",
                innerHTML: warnings
            }, this.domNode);
        } else {
            this.setUpWidgetDom();
            const type = window.device ? window.device.platform : this.onGetDeviceInformationFallback;
            const id = window.device ? window.device.uuid : "";

            this.createDeviceObject((err: mendix.lib.MxError, object: mendix.lib.MxObject) => {
                const token = Math.random().toString(36).substring(3);

                object.set(this.deviceIDAttribute, id);
                object.set(this.deviceTypeAttribute, type);
                object.set(this.tokenAttribute, token);

                this.save(object, (error: mendix.lib.MxError, obj: mendix.lib.MxObject) => {
                    window.localStorage.setItem("mx-authtoken", `${token}:${id}`);
                    mx.ui.back();
                    this.executeMicroFlow(object);
                });
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

    private createDeviceObject(callback: (error: mendix.lib.MxError | null, object?: mendix.lib.MxObject) => void) {
        window.mx.data.create({
            callback: (obj) => {
                callback(null, obj);
            },
            entity: this.deviceEntity,
            error: (err) => {
                window.mx.ui.error(`Error while creating device information: ${err.message}`),
                callback(err);
            }
        });
    }

    // tslint:disable-next-line:max-line-length
    private save(mxObject: mendix.lib.MxObject, callback: (error: mendix.lib.MxError | null, object?: mendix.lib.MxObject) => void) {
        window.mx.data.commit({
            callback: () => {
                callback(null, mxObject);
            },
            error: (err) => {
                window.mx.ui.error(`Error while saving device information: ${err.message}`),
                callback(err);
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
dojoDeclare("DeviceIdWidget.widget.DeviceIdWidget", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const property in Source.prototype) {
        if (property !== "constructor" && Source.prototype.hasOwnProperty(property)) {
            result[property] = Source.prototype[property];
        }
    }
    return result;
}(DeviceIdWidget));
