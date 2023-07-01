import { buildConfig } from 'payload/config';
import path from 'path';
import Categories from './collections/Categories';
import Posts from './collections/Posts';
import Tags from './collections/Tags';
import Users from './collections/Users';
import Media from './collections/Media';
import { PayloadWorkflow } from "../../src/index";

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
    webpack: config => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "react": path.join(__dirname, "../../node_modules/react"),
          "react-dom": path.join(__dirname, "../../node_modules/react-dom"),
          "payload": path.join(__dirname, "../../node_modules/payload"),
          "react-i18next": path.join(__dirname, "../../node_modules/react-i18next"),
        },
      },
    }),
  },
  collections: [
    Categories,
    Posts,
    Tags,
    Users,
    Media,
  ],
  plugins: [
    PayloadWorkflow({
      [Posts.slug]: {
        statuses: [
          {value: 'draft', label: 'Draft'},
          {value: 'in-progress', label: 'In Progress'},
          {value: 'ready-for-review', label: 'Ready for review'},
          {value: 'published', label: 'Published'},
        ],
        defaultStatus: 'draft'
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
