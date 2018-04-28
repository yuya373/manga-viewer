import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FileMenu from './../../components/NavBar/FileMenu.js'
import { filePerPageChanged } from './../../actions/file.js';

function mapStateToProps(state, props) {
  return ({
    perPage: state.file.perPage,
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      filePerPageChanged,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(FileMenu);
