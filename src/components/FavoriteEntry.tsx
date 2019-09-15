import React from 'react';
import { File, Directory } from '../types';
import DirectoryCardContainer from '../containers/DirectoryCardContainer';
import FileCardContainer from '../containers/FileCardContainer';

export type Props = {
  path: string;
  onPressDirectory: (path: string) => void;
};

export type StateProps = {
  path: string;
  entry: File | Directory;
};

const FavoriteEntry: React.FC<Props & StateProps> = ({
  path,
  entry,
  onPressDirectory,
}) => {
  if (entry.isDirectory) {
    return (
      <DirectoryCardContainer
        path={path}
        name={entry.name}
        onPress={onPressDirectory}
      />
    );
  }

  return <FileCardContainer fromFavorite path={path} name={entry.name} />;
};

export default FavoriteEntry;
