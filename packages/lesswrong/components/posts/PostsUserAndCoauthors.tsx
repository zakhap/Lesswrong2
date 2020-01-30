import { registerComponent, Components } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import { createStyles } from '@material-ui/core/styles';

const styles = createStyles(theme => ({
  lengthLimited: {
    maxWidth: 310,
    textOverflow: "ellipsis",
    overflowX: "hidden",
    [theme.breakpoints.down('sm')]: {
      maxWidth: 160
    },
  },
  lengthUnlimited: {
    display: "inline",
  },
}));

const PostsUserAndCoauthors = ({post, abbreviateIfLong=false, classes, simple=false}) => {
  if (!post.user || post.hideAuthor)
    return <Components.UserNameDeleted/>;
  
  return <div className={abbreviateIfLong ? classes.lengthLimited : classes.lengthUnlimited}>
    {<Components.UsersName user={post.user} simple={simple} />}
    {post.coauthors.map(coauthor =>
      <React.Fragment key={coauthor._id}>, <Components.UsersName user={coauthor} simple={simple}  /></React.Fragment>)}
  </div>;
};

PostsUserAndCoauthors.propTypes = {
  post: PropTypes.object,
  abbreviateIfLong: PropTypes.bool,
};

const PostsUserAndCoauthorsComponent = registerComponent("PostsUserAndCoauthors", PostsUserAndCoauthors, {styles});

declare global {
  interface ComponentTypes {
    PostsUserAndCoauthors: typeof PostsUserAndCoauthorsComponent
  }
}