import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import Favorite from './../components/Favorite.js';
import F from './../models/file.js';
import D from './../models/directory.js';

function mapStateToProps(state) {
  const files = state.favorite.files.reduce((a, e) => {
    const splitted = e.split("/");
    const parent = D.create(
      splitted.slice(0, splitted.length - 1).join("/"),
      {}
    );
    const file = F.create(e, {});
    return a.concat([{...file, parent}]);
  }, []);

  const directories = state.favorite.directories.reduce((a, e) => {
    const splitted = e.split("/");
    const parent = D.create(
      splitted.slice(0, splitted.length - 1).join("/"),
      {}
    );
    let dir = D.create(e, {});
    return a.concat([{...dir, parent}]);
  }, []);

  return {
    files,
    directories,
  };
}

export default connect(mapStateToProps)(Favorite);
