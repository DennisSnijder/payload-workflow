import { Config, Plugin } from "payload/config";
import { WorkflowView } from "./components/WorkflowView/WorkflowView";
import { OptionObject } from "payload/dist/fields/config/types";
import { CollectionConfig } from "payload/types";
import { generateOrderRank } from "./hooks/generateOrderRank";

export interface PluginCollectionConfig {
  statuses: OptionObject[],
  defaultStatus?: string;
  hideNoStatusColumn?: boolean;
}


const extendCollectionConfig = (
  pluginConfig: Record<string, PluginCollectionConfig>,
  collections: CollectionConfig[]
): CollectionConfig[] => collections.map((collection: CollectionConfig) => {
  if (!(collection.slug in pluginConfig)) {
    return collection;
  }

  const collectionPluginConfig = pluginConfig[collection.slug];

  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      beforeChange: [
        ...(collection.hooks?.beforeChange ?? []),
        generateOrderRank
      ],
    },
    fields: [
      ...collection.fields,
      {
        name: 'workflowStatus',
        label: 'Workflow status',
        type: "select",
        options: collectionPluginConfig.statuses,
        defaultValue: collectionPluginConfig.defaultStatus,
        admin: {
          position: 'sidebar'
        }
      },
      {
        name: 'workflowOrderRank',
        type: 'text',
        admin: {
          hidden: true
        }
      }
    ],
    admin: {
      ...collection.admin,
      pagination: {
        ...collection.admin?.pagination,
        defaultLimit: collection.admin?.pagination?.defaultLimit ?? 100
      },
      components: {
        views: {
          List: WorkflowView(collectionPluginConfig)
        }
      }
    }
  }
});

export const payloadWorkflow = (pluginConfig: Record<string, PluginCollectionConfig>): Plugin =>
  (incomingConfig: Config): Config => {

    return {
      ...incomingConfig,
      collections: extendCollectionConfig(pluginConfig, incomingConfig.collections ?? [])
    };
  }