import React from 'react';
import { registerMigration, forEachDocumentBatchInCollection } from './migrationUtils';
import { updatePostDenormalizedTags } from '../tagging/tagCallbacks';
import { Posts } from '../../lib/collections/posts/collection';


registerMigration({
  name: "denormalizeTagRelevance",
  dateWritten: "2020-03-11",
  idempotent: true,
  action: async () => {
    forEachDocumentBatchInCollection({
      collection: Posts,
      batchSize: 100,
      callback: async (posts) => {
        await Promise.all(posts.map(post => updatePostDenormalizedTags(post._id)));
      }
    });
  }
})
