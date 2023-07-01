import { Payload } from 'payload';
import path from 'path';
import { LexoRank } from "lexorank";

//Thank you, @AllesioGr for this idea on how to seed this dev/demo <3
export const seed = async (payload: Payload) => {
  payload.logger.info('Seeding data...');

  const rank = LexoRank.min();

  await payload.create({
    collection: 'users',
    data: {
      email: 'dev@payloadcms.com',
      password: 'test',
    },
  });

  await payload.create({
    collection: 'posts',
    data: {
      title: 'My first blog post',
      workflowStatus: 'draft',
      workflowOrderRank: rank.toString(),
    },
  });

  await payload.create({
    collection: 'posts',
    data: {
      title: 'The 14 New Rules of Brand Strategy',
      workflowStatus: 'draft',
      workflowOrderRank: rank.genNext().toString(),
    },
  });

  await payload.create({
    collection: 'posts',
    data: {
      title: 'How playing sports prepared me for a creative career in advertising',
      workflowStatus: 'in-progress',
      workflowOrderRank: rank.genNext().genNext().toString(),
    },
  });

  await payload.create({
    collection: 'posts',
    data: {
      title: 'Suddenly, We Don’t Have Enough People',
      workflowStatus: 'published',
      workflowOrderRank: rank.genNext().genNext().genNext().toString(),
    },
  });
};