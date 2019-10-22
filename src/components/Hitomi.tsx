import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import HitomiListItemContainer from '../containers/HitomiListItemContainer';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(4),
  },
  list: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export type StateProps = {
  url: string;
  urls: Array<string>;
};

type DispatchProps = {
  onUrlChanged: (url: string) => void;
  setHeaderTitle: (title: string) => void;
  hideHeaderBackButton: () => void;
  onScrapeClicked: () => void;
};

const Hitomi: React.FC<StateProps & DispatchProps> = ({
  url,
  urls,
  onUrlChanged,
  setHeaderTitle,
  hideHeaderBackButton,
  onScrapeClicked,
}) => {
  useEffect(() => {
    hideHeaderBackButton();
    setHeaderTitle('Hitomi');
  }, [hideHeaderBackButton, setHeaderTitle]);

  const classes = useStyles();
  const handleTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onUrlChanged(value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onScrapeClicked();
  };

  const list =
    urls.length > 0 ? (
      <List className={classes.list}>
        {urls.map(e => (
          <HitomiListItemContainer key={e} url={e} />
        ))}
      </List>
    ) : (
      <div />
    );

  return (
    <Container className={classes.container} maxWidth="lg">
      <Container className={classes.formContainer} maxWidth="md">
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="URL"
            onChange={handleTextChanged}
            value={url}
          />
        </form>
      </Container>
      <Container className={classes.listContainer} maxWidth="md">
        {list}
      </Container>
    </Container>
  );
};

export default Hitomi;
