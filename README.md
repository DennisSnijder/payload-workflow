# Payload workflow plugin
> **Note**
> This plugin is currently under active development and still in an early stage.
> Check the [roadmap](#roadmap) below in this readme for more details / upcoming features.

![Preview Image](./preview.png)

## Installation
```shell
$ yarn add payload-workflow
```

## Basic usage
```typescript
import { PayloadWorkflow } from 'payload-workflow';

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

## Differences with the draft/publish system of Payload.
The workflow plugin introduces a new field called `workflowStatus`. This field does not interact with the draft/publish system of Payload whatsoever.

You can "integrate" the workflow status with the draft/publish system of Payload yourself by using [Payloads hooks](https://payloadcms.com/docs/hooks/overview).

For example: Automatically publish the document when the `workflowStatus` has been changed to `published`.

<h2 id="roadmap">Roadmap</h3>
Upcoming Features / Ideas. Have a suggestion for the plugin? Feel free to open an issue or contribute!

- [ ] Customize card properties (currently displays `title` and `createdAt`)
- [ ] Edit relationships directly from the card (e.g., assigning users to a document)
- [ ] Toggleable column for posts without a workflow status (Currently, documents lacking `workflowStatus` aren't visible on the board)
- [ ] Lazy loading of column contents when scrolling (Currently, board only shows `defaultLimit` amount of cards)
- [ ] Permissions for changing statuses
- [ ] Allowed transitions between statuses
- [ ] Integration with the draft/publish system of Payload (?)