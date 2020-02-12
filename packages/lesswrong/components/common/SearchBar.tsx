import React, { Component } from 'react';
import { registerComponent, Components, getSetting } from 'meteor/vulcan:core';
import { InstantSearch, SearchBox, connectMenu } from 'react-instantsearch-dom';
import { withStyles, createStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import Portal from '@material-ui/core/Portal';
import { addCallback, removeCallback } from 'meteor/vulcan:lib';
import withErrorBoundary from '../common/withErrorBoundary';
import { algoliaIndexNames, isAlgoliaEnabled, getSearchClient } from '../../lib/algoliaUtil';

const VirtualMenu = connectMenu(() => null);

const styles = createStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  rootChild: {
    height: 'fit-content'
  },
  searchInputArea: {
    display: "block",
    position: "relative",
    minWidth: 48,
    height: 48,

    "& .ais-SearchBox": {
      display: 'inline-block',
      position: 'relative',
      maxWidth: 300,
      width: '100%',
      height: 46,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      fontSize: 14,
    },
    "& .ais-SearchBox-form": {
      height: '100%'
    },
    "& .ais-SearchBox-submit":{
      display: "none"
    },
    // This is a class generated by React InstantSearch, which we don't have direct control over so
    // are doing a somewhat hacky thing to style it.
    "& .ais-SearchBox-input": {
      display:"none",

      height: "100%",
      width: "100%",
      paddingRight: 0,
      paddingLeft: 48,
      verticalAlign: "bottom",
      borderStyle: "none",
      boxShadow: "none",
      backgroundColor: "transparent",
      fontSize: 'inherit',
      "-webkit-appearance": "none",
      cursor: "text",
      borderRadius:5,

      [theme.breakpoints.down('tiny')]: {
        backgroundColor: "#eee",
        zIndex: theme.zIndexes.searchBar,
        width:110,
        height:36,
        paddingLeft:10
      },
    },
    "&.open .ais-SearchBox-input": {
      display:"inline-block",
    },
  },
  searchIcon: {
    position: 'fixed',
    margin: '12px',
  },
  closeSearchIcon: {
    fontSize: 14,
  },
  searchBarClose: {
    display: "inline-block",
    position: "absolute",
    top: 15,
    right: 5,
    cursor: "pointer"
  },
  alignmentForum: {
    "& .ais-SearchBox-input": {
      color: "white",
    },
    "& .ais-SearchBox-input::placeholder": {
      color: "rgba(255,255,255, 0.5)",
    },
  },
}))

interface SearchBarProps extends WithStylesProps, WithLocationProps {
  onSetIsActive: (active: boolean)=>void,
  searchResultsArea: any,
}

interface SearchBarState {
  inputOpen: boolean,
  searchOpen: boolean,
  currentQuery: string,
}

class SearchBar extends Component<SearchBarProps,SearchBarState> {
  routerUpdateCallback: any
  
  constructor(props: SearchBarProps){
    super(props);
    this.state = {
      inputOpen: false,
      searchOpen: false,
      currentQuery: "",
    }
  }

  componentDidMount() {
    let _this = this;
    this.routerUpdateCallback = function closeSearchOnNavigate() {
      _this.closeSearch();
    };
    addCallback('router.onUpdate', this.routerUpdateCallback);
  }

  componentWillUnmount() {
    if (this.routerUpdateCallback) {
      removeCallback('router.onUpdate', this.routerUpdateCallback);
      this.routerUpdateCallback = null;
    }
  }


  openSearchResults = () => {
    this.setState({searchOpen: true});
  }

  closeSearchResults = () => {
    this.setState({searchOpen: false});
  }

  closeSearch = () => {
    this.setState({searchOpen: false, inputOpen: false});
    if (this.props.onSetIsActive)
      this.props.onSetIsActive(false);
  }

  handleSearchTap = () => {
    this.setState({inputOpen: true, searchOpen: !!this.state.currentQuery});
    if (this.props.onSetIsActive)
      this.props.onSetIsActive(true);
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') this.closeSearch();
  }

  queryStateControl = (searchState) => {
    if (searchState.query !== this.state.currentQuery) {
      this.setState({currentQuery: searchState.query});
      if (searchState.query) {
        this.openSearchResults();
      } else {
        this.closeSearchResults();
      }
    }
  }

  render() {
    const alignmentForum = getSetting('forumType') === 'AlignmentForum';

    const { searchResultsArea, classes } = this.props
    const { searchOpen, inputOpen } = this.state

    if(!isAlgoliaEnabled) {
      return <div>Search is disabled (Algolia App ID not configured on server)</div>
    }

    return <div className={classes.root} onKeyDown={this.handleKeyDown}>
      <div className={classes.rootChild}>
        <InstantSearch
          indexName={algoliaIndexNames.Posts}
          searchClient={getSearchClient()}
          onSearchStateChange={this.queryStateControl}
        >
          <div className={classNames(
            classes.searchInputArea,
            {"open": inputOpen},
            {[classes.alignmentForum]: alignmentForum}
          )}>
            {alignmentForum && <VirtualMenu attribute="af" defaultRefinement="true" />}
            <div onClick={this.handleSearchTap}>
              <SearchIcon className={classes.searchIcon}/>
              { inputOpen && <SearchBox reset={null} focusShortcuts={[]} autoFocus={true} /> }
            </div>
            { searchOpen && <div className={classes.searchBarClose} onClick={this.closeSearch}>
              <CloseIcon className={classes.closeSearchIcon}/>
            </div>}
            <div>
              { searchOpen && <Portal container={searchResultsArea.current}>
                  <Components.SearchBarResults closeSearch={this.closeSearch} />
                </Portal> }
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  }
}

const SearchBarComponent = registerComponent("SearchBar", SearchBar, withStyles(styles, {name: "SearchBar"}), withErrorBoundary);

declare global {
  interface ComponentTypes {
    SearchBar: typeof SearchBarComponent
  }
}
