import { LexoRank } from "lexorank";
import { CollectionBeforeChangeHook } from "payload/types";


/**
 * Generates the initial 'Lexorank'/orderRank based on the last known document in the same status.
 */
export const generateOrderRank: CollectionBeforeChangeHook = async ({data, req}) => {
  const {payload, collection,} = req;

  if (!collection || !!data.workflowOrderRank || !data.workflowStatus) {
    return;
  }

  const collectionData = await payload.find({
    collection: collection.config.slug,
    where: {
      workflowStatus: data.workflowStatus
    },
    sort: '-workflowOrderRank',
    limit: 1,
  });

  const lastOrderRank = collectionData.docs[0]?.workflowOrderRank ?? null;

  const lastRank =
    lastOrderRank && typeof lastOrderRank === 'string'
      ? LexoRank.parse(lastOrderRank)
      : LexoRank.min()

  const nextRank = lastRank.genNext().genNext();
  data.workflowOrderRank = nextRank.toString();

  return data;
}
