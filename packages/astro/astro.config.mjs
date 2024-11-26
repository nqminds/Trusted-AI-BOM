import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import configs from "./config.json"
import {resolve} from "url"

const {HEDGEDOC_SERVER, GITHUB_OWNER, GITHUB_REPO} = configs;
const documentGithubPath = `git/${GITHUB_OWNER}/${GITHUB_REPO}/contents/packages/astro`;
const editUrl = resolve(HEDGEDOC_SERVER, documentGithubPath)


export default defineConfig({
site: 'https://stargazers.club',
  integrations: [
    starlight({
      title: 'Intranet',
      editLink: {
        baseUrl: editUrl,
      },
	    logo: {
		  dark: './src/assets/nquiringminds_dark.svg',
		  light: './src/assets/nquiringminds_light.png',
	    },
      social: {
        github: `https://github.com/nqminds/${GITHUB_REPO}`,
      },
      sidebar: [
        {
			label: 'Project Management',
			autogenerate: { directory: 'project-management' },
		},
        {
          label: 'Schemas',
          autogenerate: { directory: 'schemas' },
        },
		{
			label: 'SDK',
			autogenerate: { directory: 'sdk' },
		},
		{
			label: 'Docs',
			autogenerate: { directory: 'working-docs' },
		},
      ],
    }),
  ],
});