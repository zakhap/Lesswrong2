import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';
import { useCurrentUser } from '../common/withUser';

const SequencesPostsList = ({posts, chapter}: {
  posts: Array<any>,
  chapter?: any,
}) => {
  const currentUser = useCurrentUser();
  return <div>
    {posts.map((post) => <Components.PostsItem2 key={post._id} post={post} chapter={chapter} />)}
  </div>
}

const SequencesPostsListComponent = registerComponent('SequencesPostsList', SequencesPostsList)

declare global {
  interface ComponentTypes {
    SequencesPostsList: typeof SequencesPostsListComponent
  }
}
