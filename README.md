# Mobile Device Widget
* Gets device information. It is recommended to use this widget for mendix hybrid application.

# Features
* Set the Device ID , device type and random device token
* Executes the microflow with the device object. This widget also closes the current page so then when a back/close action is performed on the next page the app is closed
* Show or close page upon device information retrievable.

## Dependencies
* Mendix version 6.10 or up
* Add cordova-plugin-app-version to your phonegap app like this.

    ` <plugin name="cordova-plugin-app-version" source="npm" spec="0.1.8" />`

## How it Works
The widget will save device information to a configured context object. The version and build
information are only available when `cordova-plugin-app-version` is used.

## Demo project
http://deviceidwidget.mxapps.io

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

Create a Mendix test project in the dist folder and rename its root folder to MxTestProject. Changes to the widget code shall be automatically pushed to this test project. Or get the test project from [https://github.com/mendixlabs/mobile-device/releases/download/v1.0.0/TestMobileDeviceWidget.mpk](https://github.com/mendixlabs/mobile-device/releases/download/v1.0.0/TestMobileDeviceWidget.mpk)

    dist/MxTestProject

To automatically compile, bundle and push code changes to the running test project, run:

    grunt
