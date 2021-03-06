import Users from '../users/collection';
import { schemaDefaultValue, } from '../../collectionUtils';
import { resolverOnlyField, SchemaType } from '../../../lib/utils/schemaUtils';
//
// Votes. From the user's perspective, they have a vote-state for each voteable
// entity (post/comment), which is either neutral (the default), upvote,
// downvote, big-upvote or big-downvote.
//
// When you vote and then change it, three things happen. A new vote is created
// for the new vote state (unless that's neutral). First, the old vote has
// 'cancelled' set to true. Second, an "unvote" is created, also with cancelled
// set to true, but with the timestamp corresponding to the moment you changed
// the vote. The power of an unvote is the opposite of the power of the vote
// that was reversed.
//

const docIsTagRel = (currentUser, document) => {
  // TagRel votes are treated as public
  return document?.collectionName === "TagRels"
}

const schema: SchemaType<DbVote> = {
  // The id of the document that was voted on
  documentId: {
    type: String,
    canRead: ['guests'],
    // No explicit foreign-key relation because which collection this is depends on collectionName
  },

  // The name of the collection the document belongs to
  collectionName: {
    type: String,
    canRead: ['guests'],
  },

  // The id of the user that voted
  userId: {
    type: String,
    canRead: [Users.owns, docIsTagRel, 'admins'],
    foreignKey: 'Users',
  },
  
  // The ID of the author of the document that was voted on
  authorId: {
    type: String,
    denormalized: true, // Can be inferred from documentId
    canRead: ['guests'],
    foreignKey: 'Users',
  },

  // The type of vote, eg smallDownvote, bigUpvote. If this is an unvote, then
  // voteType is the type of the vote that was reversed.
  voteType: {
    type: String,
    canRead: ['guests'],
  },

  // The vote power - that is, the effect this vote had on the comment/post's
  // score. Positive for upvotes, negative for downvotes, based on whether it's
  // a regular or strong vote and on the voter's karma at the time the vote was
  // made. If this is an unvote, then the opposite: negative for undoing an
  // upvote, positive for undoing a downvote.
  power: {
    type: Number,
    optional: true,
    canRead: [Users.owns, docIsTagRel, 'admins'],
    
    // Can be inferred from userId+voteType+votedAt (votedAt necessary because
    // the user's vote power may have changed over time)
    denormalized: true,
  },
  
  // The vote's alignment-forum power - that is, the effect this vote had on
  // the comment/post's AF score.
  afPower: {
    type: Number,
    optional: true,
    canRead: [Users.owns, docIsTagRel, 'admins'],
  },
  
  // Whether this vote has been cancelled (by un-voting or switching to a
  // different vote type) or is itself an unvote/cancellation.
  cancelled: {
    type: Boolean,
    canRead: ['guests'],
    ...schemaDefaultValue(false),
  },
  
  // Whether this is an unvote.
  isUnvote: {
    type: Boolean,
    canRead: ['guests'],
    ...schemaDefaultValue(false),
  },

  // Time this vote was cast. If this is an unvote, the time the vote was
  // reversed.
  votedAt: {
    type: Date,
    optional: true,
    canRead: [Users.owns, docIsTagRel, 'admins'],
  },

  tagRel: resolverOnlyField({
    type: "TagRel",
    graphQLtype: 'TagRel',
    canRead: [docIsTagRel, 'admins'],
    resolver: (vote: DbVote, args: void, { TagRels }: ResolverContext) => {
      if (vote.collectionName === "TagRels") {
        const tagRel = TagRels.find({_id: vote.documentId}).fetch()[0]
        if (tagRel) {
          return tagRel
        }
      }
    }
  }),

};

export default schema;
