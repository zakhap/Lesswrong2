import { createCollection } from '../../vulcan-lib';
import { addUniversalFields, ensureIndex } from '../../collectionUtils'
import type { SchemaType } from '../../utils/schemaUtils'

const schema: SchemaType<DbLegacyData> = {
  objectId: {
    type: String,
  },
  collectionName: {
    type: String,
  },
  legacyData: {
    type: Object,
    blackbox: true
  },
};

export const LegacyData: LegacyDataCollection = createCollection({
  collectionName: "LegacyData",
  typeName: "LegacyData",
  schema
});

addUniversalFields({collection: LegacyData});
ensureIndex(LegacyData, {objectId:1});

export default LegacyData;
