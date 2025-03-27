# Trusted-AI-BOM

To build website - go to packages/docusaurus

### Setup 
install nvm
* curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
install node
* nvm use 18
install docusauus
* npm instll
run
* npm start 
### Make edits
edit files
- git add -A *
- git commit
- git push
### Deploy to main
https://taibom.org 
https://github.com/nqminds/Trusted-AI-BOM/actions/workflows/deploy-public.yaml
OR
first install gh
- snap install gh
- authenticate gh 'gh auth login' use token
- list workflow 'gh workflow list'
- run 
## Docusaurus

There are two flavours of Trusted-AI-Bom docusaurus site. 

### docusaurus.project.config
Site for project collaborators (which deploys from the main branch). This includes the project management tab and the edit buttons and should be password protected

#### Running

`npm start`

#### building

`npm run build`

#### Deploying

Deploymenty is through manual github workflow or when a change is made to the main branch

### docusaurus.public.config
Site for public view

#### Running

`npm start:public`

#### building

`npm run build:public`

#### Deploying

Deploymenty is through manual github workflow only
