import React, { useEffect, useCallback, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { VirtuosoGrid } from 'react-virtuoso';
import { makeStyles, useTheme } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import { Theme } from '@material-ui/core';
import { fetchEntries } from '../actions/directory';
import { deserializePath, serializePath } from '../utils';
import { headerTitleChanged } from '../actions/header';
import { RootState } from '../reducers';
import FileCard from './FileCard';
import DirectoryCard from './DirectoryCard';

const HEADER_HEIGHT = 64;

type StyleProps = {
  theme: Theme;
};

const useStyles = makeStyles({
  progressWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
    height: '100%',
  },
  itemsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: ({ theme }: StyleProps) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    width: '25%',
    [theme.breakpoints.up('xl')]: {
      width: '25%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '33%',
    },
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
  }),
});

interface Params {
  serializedPath: string;
}

const EntryList: React.FC<RouteComponentProps<Params>> = ({
  match,
  history,
}) => {
  const { serializedPath } = match.params;
  const path = deserializePath(serializedPath);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchEntries(path));
    dispatch(headerTitleChanged(path));
  }, [dispatch, path]);

  const entries = useSelector((state: RootState) => {
    const directory = state.directories.byPath[path];
    return directory ? directory.entries : [];
  });

  const onPressDirectoryCard = useCallback(
    (deserializedPath: string) => {
      history.push(`/entryList/${serializePath(deserializedPath)}`);
    },
    [history]
  );

  const renderItem = useCallback(
    (index: number) => {
      const entry = entries[index];
      if (entry == null) return <div />;

      if (entry.isDirectory) {
        return (
          <DirectoryCard
            path={path}
            name={entry.name}
            onPress={onPressDirectoryCard}
          />
        );
      }

      return <FileCard path={path} name={entry.name} />;
    },
    [entries, onPressDirectoryCard, path]
  );

  const isLoading = useSelector((state: RootState) => {
    return Boolean(state.directories.isLoading[path]);
  });

  const [listHeight, setListHeight] = useState(
    window.innerHeight - HEADER_HEIGHT
  );

  useEffect(() => {
    const onResize = () => {
      const newListHeight = window.innerHeight - HEADER_HEIGHT;
      setListHeight(newListHeight);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const theme = useTheme<Theme>();
  const classes = useStyles({ theme });

  if (isLoading) {
    return (
      <Container
        className={classes.progressWrapper}
        style={{ height: listHeight }}
      >
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <VirtuosoGrid
      style={{ height: listHeight, width: '100%' }}
      listClassName={classes.itemsWrapper}
      itemClassName={classes.item}
      totalCount={entries.length}
      item={renderItem}
    />
  );
};

export default EntryList;
