# Jira Node Time

This project contains a Forge app written in Javascript that displays a node graph view of your issues and their dependencies in a Jira Project Page.

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start
- Install dependencies (inside root directory)

```sh
npm install
cd static/node-time
npm install
cd -
```

- Modify your app by editing the files in `static/node-time/src/`.

- Build your app (inside of the `static/node-time` directory):
```sh
npm run build
```

- Deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

### Dev loop

```sh
cd static/node-time
npm run start
```

```sh
forge tunnel
```

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.

