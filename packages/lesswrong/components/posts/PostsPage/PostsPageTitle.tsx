import React from 'react'
import { registerComponent } from '../../../lib/vulcan-lib';
import Typography from '@material-ui/core/Typography';
import { Link } from '../../../lib/reactRouterWrapper';
import { Posts } from '../../../lib/collections/posts';
import * as _ from 'underscore';

const styles = (theme: ThemeType): JssStyles => ({
  root: {
    ...theme.typography.display3,
    ...theme.typography.postStyle,
    ...theme.typography.headerStyle,
    margin: "0 !important",
    color: theme.palette.text.primary,
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem',
    }
  },
  draft: {
    color: theme.palette.grey[500]
  },
  question: {
    color: theme.palette.grey[600],
    display: "block",
  }
})

const PostsPageTitle = ({classes, post}: {
  classes: ClassesType,
  post: PostsDetails,
}) => {
  const parentPost = _.filter(post.sourcePostRelations, rel => !!rel.sourcePost)?.[0]?.sourcePost

  
  return (
    <div>
      {post.question && !parentPost && <Typography variant="title">
        <Link to="/questions" className={classes.question}>
          [ Question ] 
        </Link>
      </Typography>}
      {post.question && parentPost && <Typography variant="title">
        <Link to={Posts.getPageUrl(parentPost)} className={classes.question}>
          [ Parent Question — {parentPost.title} ]
        </Link>
      </Typography>}
      <Typography variant="display3" className={classes.root}>
        {post.draft && <span className={classes.draft}>[Draft] </span>}
        {post.title}
      </Typography>
    </div>
  )
}


const PostsPageTitleComponent = registerComponent('PostsPageTitle', PostsPageTitle, {styles});

declare global {
  interface ComponentTypes {
    PostsPageTitle: typeof PostsPageTitleComponent
  }
}
