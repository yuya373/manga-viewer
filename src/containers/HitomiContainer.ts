import { connect } from 'react-redux';
import { RootState } from '../reducers';
import Hitomi, { StateProps } from '../components/Hitomi';
import { urlChanged, scrape } from '../actions/hitomi';
import { headerTitleChanged, headerHideBackButton } from '../actions/header';

const mapStateToProps = (state: RootState): StateProps => {
  const { url } = state.hitomi;

  return {
    url,
  };
};

const mapDispatchToProps = {
  onUrlChanged: urlChanged,
  setHeaderTitle: headerTitleChanged,
  hideHeaderBackButton: headerHideBackButton,
  onScrapeClicked: scrape,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hitomi);
