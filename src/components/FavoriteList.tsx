import React, { useState, useCallback, useEffect } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { RouteComponentProps } from 'react-router';
import { useStyles, HEADER_HEIGHT } from './EntryList';
import useWindowDimension from '../hooks/useWindowDimension';
import { serializePath } from '../utils';
import FavoriteEntryContainer from '../containers/FavoriteEntryContainer';

export type StateProps = {
  favorites: Array<string>;
};

export type DispatchProps = {
  setHeaderTitle: (title: string) => void;
  hideHeaderBackButton: () => void;
};

const FavoriteList: React.FC<
  StateProps & DispatchProps & RouteComponentProps
> = ({ favorites, history, setHeaderTitle, hideHeaderBackButton }) => {
  const classes = useStyles();
  const [listHeight, setListHeight] = useState(window.innerHeight);

  useWindowDimension(({ height }: { height: number }) => {
    setListHeight(height - HEADER_HEIGHT);
  });

  useEffect(() => {
    hideHeaderBackButton();
    setHeaderTitle('Favorite');
  }, [hideHeaderBackButton, setHeaderTitle]);

  const onPressDirectory = useCallback(
    (deserializedPath: string) => {
      const path = serializePath(deserializedPath);
      history.push(`/entryList/${path}`);
    },
    [history]
  );

  const renderItem = useCallback(
    (index: number) => {
      const path = favorites[index];
      if (path == null) return <div />;
      return (
        <FavoriteEntryContainer
          path={path}
          onPressDirectory={onPressDirectory}
        />
      );
    },
    [favorites, onPressDirectory]
  );

  return (
    <VirtuosoGrid
      style={{ height: listHeight, width: '100%' }}
      listClassName={classes.itemsWrapper}
      itemClassName={classes.item}
      totalCount={favorites.length}
      item={renderItem}
    />
  );
};

export default React.memo(FavoriteList);
