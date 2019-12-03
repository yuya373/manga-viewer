import { connect } from 'react-redux';
import { RootState } from '../app';
import Hitomi, { StateProps } from '../components/Hitomi';
import { urlChanged, scrape } from '../actions/hitomi';
import { headerTitleChanged, headerHideBackButton } from '../actions/header';

const mapStateToProps = (state: RootState): StateProps => {
  const { url, urls } = state.hitomi;

  return {
    url,
    urls,
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
