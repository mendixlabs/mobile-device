# Device ID Widget
* get device information

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

To run the project unit tests with code coverage, results can be found at dist/testresults/coverage/index.html, run:

    npm test

or run the test continuously during development:

    karma start
