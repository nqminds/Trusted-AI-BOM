# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Setup 

* install nvm `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
* install node `nvm use 18`
* install docusauus `npm install`
* run `npm start`
  
### Make edits

edit files

- `git add -A *`
- `git commit`
- `git push`

### Deploy to main
https://taibom.org 
https://github.com/nqminds/Trusted-AI-BOM/actions/workflows/deploy-public.yaml

OR

first install gh
- `snap install gh`
- authenticate gh `gh auth login` use token
- list workflow`gh workflow list`
- run 

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## PDF

to gnerate a PDF run 

`npm run pdf`

to generate a pdf for a section:

`npm run pdf docs/path/to/section`
