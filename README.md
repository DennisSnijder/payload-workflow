# Payload workflow plugin
> **Note**
> This plugin is currently under active development and still in an early stage.
> Check the roadmap below in this readme for more details / upcoming features.

![Preview Image](./preview.png)

## Installation
```shell
$ yarn add payload-workflow
```

## Basic usage
```typescript
import { PayloadWorkflow } from 'payload-wokflow';

const config = buildConfig({
  collections: [...],
  plugins: [
    PayloadWorkflow({
      'my-collection-slug': {
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
});
```

## Roadmap
Upcoming Features / Ideas. Have a suggestion for the plugin? Feel free to share!

- [ ] Customize card properties (currently displays `title` and `createdAt`)
- [ ] Edit relationships directly from the card (e.g., assigning users to a document)
- [ ] Integration with the draft/publish system of payload (?)
- [ ] Configurable column for posts without a status (Currently, documents lacking `workflowStatus` aren't visible on the board)
- [ ] Lazy loading of column contents when scrolling (Currently, board only shows `defaultLimit` amount of cards)