import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export type StateProps = {
  url: string;
};

type DispatchProps = {
  onUrlChanged: (url: string) => void;
  setHeaderTitle: (title: string) => void;
  hideHeaderBackButton: () => void;
  onScrapeClicked: () => void;
};

const Hitomi: React.FC<StateProps & DispatchProps> = ({
  url,
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
  const handleScrapeClicked = () => {
    onScrapeClicked();
  };

  return (
    <Container className={classes.container} maxWidth="lg">
      <Container maxWidth="md">
        <TextField
          fullWidth
          placeholder="URL"
          onChange={handleTextChanged}
          value={url}
        />

        <div className={classes.buttonContainer}>
          <Button
            disabled={url.length < 1}
            variant="outlined"
            onClick={handleScrapeClicked}
          >
            Scrape
          </Button>
        </div>
      </Container>
    </Container>
  );
};

export default Hitomi;
