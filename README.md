# Trusted-AI-BOM

To build website - go to packages/docusaurus

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
