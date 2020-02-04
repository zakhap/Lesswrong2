import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core'
import { algoliaIndexNames } from '../../lib/algoliaUtil';

const UsersSearchAutoComplete = ({clickAction, label}) => {
  return <Components.SearchAutoComplete
    indexName={algoliaIndexNames.Users}
    clickAction={clickAction}
    renderSuggestion={hit => <Components.UsersAutoCompleteHit document={hit} />}
    renderInputComponent={hit => <Components.UsersSearchInput inputProps={hit} />}
    placeholder={label || "Search for Users"}
    noSearchPlaceholder='User ID'
  />
}

registerComponent("UsersSearchAutoComplete", UsersSearchAutoComplete);