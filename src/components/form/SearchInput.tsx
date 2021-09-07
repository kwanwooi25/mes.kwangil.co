import classnames from 'classnames';
import { useDebounce } from 'hooks/useDebounce';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { alpha, createStyles, IconButton, InputBase, makeStyles, Theme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchInput: {
      position: 'relative',
      borderRadius: 43 / 2,
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.light, 0.2),
      },
      width: '100%',
      padding: theme.spacing(0.5),
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    input: {
      padding: theme.spacing(1, `calc(1em + ${theme.spacing(4)}px)`),
      transition: theme.transitions.create('width'),
      width: '100%',
    },
    resetIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      top: 0,
      right: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

export interface SearchInputProps {
  className?: string;
  placeholder?: string;
  searchDelay?: number;
  onSearch: (searchText: string) => void;
  maxWidth?: number;
  autoFocus?: boolean;
}

const SearchInput = ({
  className,
  placeholder = '',
  searchDelay = 300,
  onSearch,
  maxWidth,
  autoFocus = false,
}: SearchInputProps) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState<string>('');
  const debouncedSearchText = useDebounce(searchText, searchDelay);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);

  const resetSearchText = () => setSearchText('');

  useEffect(() => {
    onSearch(debouncedSearchText);
  }, [debouncedSearchText]);

  return (
    <div className={classnames([className, classes.searchInput])} style={{ maxWidth }}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder={placeholder}
        classes={{
          root: classes.inputRoot,
          input: classes.input,
        }}
        inputProps={{ 'aria-label': 'search', onChange: handleChange, value: searchText }}
        autoFocus={autoFocus}
      />
      {!!searchText && (
        <div className={classes.resetIcon}>
          <IconButton size="small" onClick={resetSearchText}>
            <CloseIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
