# Extension for Google Chrome

## Installation

```sh
$ git clone [git-repo-url]
$ cd [repo-url]
$ npm run build:all
```

## Load Extension on Google Chrome

1. Open [Google Chrome](https://www.google.com/chrome/).
1. Go to [chrome://extensions/](chrome://extensions/).
2. Select `Load unpacked`.
3. Select the [ext](./ext) directory in the project.
4. Click `Select`.

## More

### Create package for Chrome Web Store
```sh
npm run pack
```
The new package ready for the upload on the Google Web Store will be placed on the [package](./package) directory.
You can upload it from the [Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard).

### Build in watch mode
```sh
npm run build:watch
```

### Full clean of the project
```sh
npm run clean:all
```
