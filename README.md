# LeaderLink

LeaderLink is a Single Page Application for managing and tracking the progress of a leadership program.

The app is responsive across desktop, tablet and mobile devices, built with Angular @^12 and Typescript @~4.3, Bootstrap @~4.5 and Sass. NgRx is used for state management.

### [Live demo](https://leaderlink.dmxnetworks.com.au/)

<img src="https://user-images.githubusercontent.com/8167628/217879827-9837a0ef-c178-4390-ac25-baa0fb4b2c96.png" alt="Screenshot tablet/laptop/desktop" width="auto" height="auto">

<img src="https://user-images.githubusercontent.com/8167628/217881229-447a923c-b06c-4f0f-88f0-31858e1c5cfb.png" alt="Screenshot mobile phone" width="auto" height="auto">

### Frameworks and Libraries

| angular @^12 | ng-bootstrap with bootstrap @~4.5 | ng-draggable |
|--------------|-----------------------------------|--------------|

This project was originally generated with [Angular CLI](https://github.com/angular/angular-cli) @8 and then progressively upgraded to @^12 which is the last version to support [TSLint](https://palantir.github.io/tslint/) tests and e2e tests with [Protractor](http://www.protractortest.org/)

## Table of Contents

- [Development server](#development-server)
- [Production](#production)
- [Tests](#tests)
- [Quick Start](#quick-start)
- [Code scaffolding](#code-scaffolding)
- [Further help](#further-help)
- [Browser Support](#browser-support)
- [Licensing](#licensing)

## Development server

The app will automatically reload when any of the source files is edited.

`npm run start` to serve project as local dev server. Navigate to `http://localhost:4300/`

`npm run start:mock` to serve project as local dev server with mock data server. Navigate to `http://localhost:4300/`

`npm run mock:server` for a mock data server alone. API endpoints with local data.  

`npm run build` to build the project for dev deployment. Build artifacts will be stored in the `dist/` directory.

## Production

`npm run build:prod` to build project for production deployment. Build artifacts will be stored in the `dist/` directory.

## Tests

`npm run lint` static analysis TypeScript linter with [TSLint](https://palantir.github.io/tslint/)

`npm run test` unit tests with [Karma](https://karma-runner.github.io)

`npm run e2e` e2e tests with [Jasmine](https://jasmine.github.io/) and [Protractor](http://www.protractortest.org/)

`npm run e2e:mock` e2e tests with local mock data server

## Quick start

1. Download and Install NodeJs LTS version from [NodeJs Official Page](https://nodejs.org/en/download/).
2. Navigate to the root ./ directory of the product and run `yarn install` or `npm install` to install our local dependencies.

## Code scaffolding

`ng generate component component-name` to generate a new component.

You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Browser Support

Support for the last two versions of the following browsers:

<img src="https://user-images.githubusercontent.com/8167628/217873263-6c82b338-0224-4cba-a838-fbda3c9369be.png" alt="Chrome" width="64" height="64"> <img src="https://user-images.githubusercontent.com/8167628/217873253-9ed89380-46d7-4a7a-b061-fbdcd3b434c9.png" width="64" height="64" alt="Firefox"> <img src="https://user-images.githubusercontent.com/8167628/217873244-e04d4bcd-b74c-4f7d-b186-5dc7531a9850.png" width="64" height="64" alt="Edge"> <img src="https://user-images.githubusercontent.com/8167628/217873233-14d55c72-8510-4c43-822f-4d696081ec73.png" width="64" height="64" alt="Safari"> <img src="https://user-images.githubusercontent.com/8167628/217873214-a4312eef-d83d-4526-b0fa-15a6630af966.png" width="64" height="64" alt="Opera">

## Licensing

- Copyright 2023 [Mojo Soup](https://mojosoup.com.au/)
- Mojo Soup [license terms](https://mojosoup.com.au/terms/)
