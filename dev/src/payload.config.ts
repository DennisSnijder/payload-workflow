import { buildConfig } from 'payload/config';
import path from 'path';
import Categories from './collections/Categories';
import Posts from './collections/Posts';
import Tags from './collections/Tags';
import Users from './collections/Users';
import Media from './collections/Media';
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import { webpackBundler } from "@payloadcms/bundler-webpack";

import { payloadWorkflow } from "../../src/index";

export default buildConfig({
  serverURL: 'http://localhost:3000',

  editor: slateEditor({}),
  db: mongooseAdapter({
    url: `${ process.env.MONGODB_URI }`,
  }),
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: (config) => {
      config.plugins = [
        ...config.plugins as [],
      ];
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          react: path.join(__dirname, '../node_modules/react'),
          'react-dom': path.join(__dirname, '../node_modules/react-dom'),
          'react-router': path.join(__dirname, '../node_modules/react-router'),
          'react-router-dom': path.join(__dirname, '../node_modules/react-router-dom'),
          'react-i18next': path.join(__dirname, '../node_modules/react-i18next'),
          payload: path.join(__dirname, '../node_modules/payload'),
        }
      };

      return config
    }
  },
  collections: [
    Categories,
    Posts,
    Tags,
    Users,
    Media,
  ],
  plugins: [
    payloadWorkflow({
      [Posts.slug]: {
        statuses: [
          {value: 'draft', label: 'Draft'},
          {value: 'in-progress', label: 'In Progress'},
          {value: 'ready-for-review', label: 'Ready for review'},
          {value: 'published', label: 'Published'},
        ],
        defaultStatus: 'draft',
        hideNoStatusColumn: false
      }
    })
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
});
