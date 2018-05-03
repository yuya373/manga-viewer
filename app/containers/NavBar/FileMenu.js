import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FileMenu from './../../components/NavBar/FileMenu.js'
import {
  filePerPageChanged,
  fileFavoriteChanged,
} from './../../actions/file.js';

function mapStateToProps(state, props) {
  return ({
    filePath: props.filePath,
    favorite: state.favorite.files.includes(props.filePath),
    perPage: state.file.perPage,
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      filePerPageChanged,
      fileFavoriteChanged,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(FileMenu);
