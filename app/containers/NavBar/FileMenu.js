import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FileMenu from './../../components/NavBar/FileMenu.js'
import {
  filePerPageChanged,
  fileFavoriteChanged,
} from './../../actions/file.js';
import {
  toggleDialog as toggleTagsDialog,
} from './../../actions/tag.js';

function mapStateToProps(state, { file }) {
  const tags = Object.keys(state.tag.tags).
        filter((e) => state.tag.tags[e].includes(file.path));

  return ({
    file,
    tags,
    favorite: state.favorite.files.includes(file.path),
    perPage: state.file.perPage,
    tagsDialogOpen: state.tag.dialogIsOpen,
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      filePerPageChanged,
      fileFavoriteChanged,
      toggleTagsDialog,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(FileMenu);
