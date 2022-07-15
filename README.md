# SpaceBar

A simple multiplayer 3D environment with spatial video/audio made with WebRTC, WebGL and Three.js.

![image](https://user-images.githubusercontent.com/31911175/179121719-bb7fce7e-ca49-48c2-9525-d50d09afc91c.png)

## Branches

Branches should be named with name/branch-name. For example, shalin/simple-peer-integration.

## Commits

Commits should be named with topic: description. For example, README: updated description. This makes it easier to view when viewing `git log`s.

## Linting

Linting is automatically run whenever you `git commit`. Linting does not fix issues by default. Linting on commit will only run the linters (`eslint` and `prettier`) on files staged for commit. In order to run linting on all files, use the `./spacebar` shell script with parameter `lint`. To run linting on all files and fix errors, run `./spacebar lint --fix`. To ignore linting on a commit, run `git commit` with the `--no-verify` flag. Do not close a pull request until all modified files have been linted and fixed.
