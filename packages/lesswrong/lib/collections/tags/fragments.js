import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment TagFragment on Tag {
    _id
    name
    slug
    postCount
    description {
      html
    }
  }
`);

registerFragment(`
  fragment TagEditFragment on Tag {
    _id
    name
    slug
    postCount
    description {
      ...RevisionEdit
    }
  }
`);