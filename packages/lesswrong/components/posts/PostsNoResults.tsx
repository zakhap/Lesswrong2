import { registerComponent } from '../../lib/vulcan-lib';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const styles = (theme: ThemeType): JssStyles => ({
  root: {
    marginLeft: theme.spacing.unit,
    fontStyle: "italic",
    color: theme.palette.grey[500]
  }
});

const PostsNoResults = ({classes}: {
  classes: ClassesType,
}) =>
  <Typography variant="body2" className={classes.root}>
    No posts to display.
  </Typography>;

const PostsNoResultsComponent = registerComponent('PostsNoResults', PostsNoResults, {styles});

declare global {
  interface ComponentTypes {
    PostsNoResults: typeof PostsNoResultsComponent
  }
}

