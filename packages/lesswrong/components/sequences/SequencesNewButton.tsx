import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';
import { Link } from '../../lib/reactRouterWrapper';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';

const styles = theme => ({
  newSequence: {
    color: theme.palette.primary.light
  }
});

export const SequencesNewButton = ({ classes }) => {
  const { SectionButton } = Components
  return  <Link to={"/sequencesnew"}> 
    <SectionButton>
      <LibraryAddIcon />
      Create New Sequence
    </SectionButton>
  </Link>
}

const SequencesNewButtonComponent = registerComponent('SequencesNewButton', SequencesNewButton, {styles});

declare global {
  interface ComponentTypes {
    SequencesNewButton: typeof SequencesNewButtonComponent
  }
}
