# Mobile Device Widget
Gets device information. It is recommended to use this widget for mendix hybrid application.The widget retrieves information about your device and mobile app. It can retrieve the following data:
- Device ID: the unique id of the device
- Device platform: the platform on which the app runs, e.g. Android/iOS/Web.
- App name: the user friendly name of app that is also displayed on your home screen and in the app store, e.g. MyAwesomeApp
- App ID: the unique identifier of your mobile app, e.g. com.mycompany.awesomeapp.
- App version: the version of your mobile app, e.g. 1.2.1.

# Features
* Set the Device ID , platform / device type
* Executes the microflow after the device information is retrieved. 
* This widget also closes the current page so that when a back/close action is performed on the next page the app is closed
* Show page upon device information retrievable.

# Use cases

### Device based settings
The Device ID is very useful for anonymous apps in which you still want to persist data per device. By using the device ID you can store data related to the device so the next time the user opens the app on that device you can load the correct data/settings.

### Differentiate the UI for Android and iOS.
Android and iOS have different design patterns and guidelines. By leveraging the platform info of this widget you can change the UI based on the platform. An example is to show a back button only on iOS because Android has a standard back button. However, you could also use it for a more differentiating UI/UX.

### Multi Label Mobile Apps
Several companies want to publish multiple apps to the app stores under a different label/brand but use a single model. With this widget you can use the app identifier or name to easily determine the current label/brand of the mobile app and adjust the content and look and feel.

### Mobile App Version Check
In some cases, it is important that users have downloaded the latest/right version of the mobile app from the app store. For example, when you updated a plugin because of security vulnerabilities or when your mobile app depends on a certain plugin that is recently added. By leveraging the app version, you can check whether the user has installed the correct version of the app and notify the user to download the latest version from the app store.

## Dependencies
* Mendix version 6.10 or up
* Add cordova-plugin-app-version to your phonegap app like this.

    ` <plugin name="cordova-plugin-app-version" source="npm" spec="0.1.8" />`

## How it Works
Once the widget has been set in the context of any object and the right parameters configured, the widget will save device information to the context object. It should be noted that the version and build
information are only available when `cordova-plugin-app-version` is used in the project config.

## Demo project
http://deviceidwidget.mxapps.io

## Usage

### Data source
 On the `Data source` option of the `Data source` tab, select and set the respective attributes as string
<img src="https://raw.githubusercontent.com/mendixlabs/mobile-device/v1.0.1/assets/datasource.png" />

 On the `on get device information` option of the `Events` tab, select and set the `on get device information` action to specify what type of action should be performed when the information is retrieved. There are three options:
 - `nothing` means no action is performed
 - `Show page` implies a `page` is supposed to be shown in and that case you select and set the `Page` from the `Page` option.
 - `Microflow` indicates the `microflow` action that should executed when the device object is retrieved and in that case you select and set the `Microflow`.

<img src="https://raw.githubusercontent.com/mendixlabs/mobile-device/v1.0.1/assets/events.png" />

## Issues, suggestions and feature requests
Please report issues at [https://github.com/mendixlabs/mobile-device/issues](https://github.com/mendixlabs/mobile-device/issues).


## Development
Prerequisite: Install git, node package manager, webpack CLI, grunt CLI, Karma CLI

To contribute, fork and clone.

    git clone https://github.com/mendixlabs/mobile-device.git

The code is in typescript. Use a typescript IDE of your choice, like Visual Studio Code or WebStorm.

To set up the development environment, run:

    npm install

Create a folder named dist in the project root.

Create a Mendix test project in the dist folder and rename its root folder to MxTestProject. Changes to the widget code shall be automatically pushed to this test project. Or get the test project from [https://github.com/mendixlabs/mobile-device/releases/download/v1.0.1/TestMobileDeviceWidget.mpk](https://github.com/mendixlabs/mobile-device/releases/download/v1.0.1/TestMobileDeviceWidget.mpk)

    dist/MxTestProject

To automatically compile, bundle and push code changes to the running test project, run:

    grunt
