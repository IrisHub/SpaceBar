# 3-D Spatial Audio
A simple 3D spatial audio environment made with WebRTC, WebGL and Three.js

## Branches
Branches should be named with name/branch-name. For example, shalin/simple-peer-integration.
## Commits
Commits should be named with topic: description. For example, README: updated description. This makes it easier to view when viewing `git log`s.
## Linting
Use the following lint protocol before pushing to any branch. There are no automated lint checks in place yet, but they will likely be coming soon.

1. Download the ESLint extension in VSCode.
2. Within your project, run `npm i eslint --save-dev` to download the `eslint` module.
3. Run `./node_modules/.bin/eslint --init` to configure your linter

    **How would you like to use ESLint?** `To check syntax, find problems, and enforce code style`

    **What type of modules does your project use?** `Javascript modules (import/export)`

    **Which framework does your project use?** `React`

    **Does your project use TypeScript?** `Yes` (only if using a TS-configured `create-react-app`, otherwise `no`)

    **Where does your code run?** `Browser`

    **Which style guide do you want to follow?** `Use a popular style guide --> Airbnb`

    **What format do you want your config file to be in?** `JSON`

    **Would you like to install (dependencies) with npm?** `Yes`
4. React by default renders JSX-style html in default JS files like App.js. To prevent this from throwing linter errors, enter your `.eslint.json` config and add the below rule:
```
"rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
}
```
5. Linting is now set up by default. You can enter the command palette (`Cmd + Shift + P` by default) and run `> ESLint: Fix all auto-fixable problems` to auto-fix most linter errors. Alternatively, you can configure VSCode to run the linter on _every save_ by going to **Code > Preferences > Settings > Text Editor > "Editor: Code Actions on Save" > "Edit in settings.json"** and adding the following to `User/<yourname>/Library/Application Support/Code/User/settings.json`:
```
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
},
"eslint.validate": ["javascript"]
```
This approach is recommended to make sure your code is clean as you're writing it!

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).