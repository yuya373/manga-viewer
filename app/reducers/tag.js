import {
  ADD_TAG,
  DELETE_TAG,
} from './../actions/tag.js';

const initialState = {
  tags: {},
};

function addTag(state, {filePath, tag}) {
  if (state.tags[tag]  && state.tags[tag].length > 0) {
    return {
      ...state,
      tags: {
        ...state.tags,
        [tag]: state.tags[tag].filter((e) => e !== filePath).concat([filePath]),
      },
    };
  }

  return {
    ...state,
    tags: {
      ...state.tags,
      [tag]: [filePath],
    },
  };
}

function deleteTag(state, {filePath, tag}) {
  const newTag = state.tags[tag].filter((e) => e !== filePath);
  return {
    ...state,
    tags: {
      ...state.tags,
      [tag]: newTag,
    },
  };
}

export default function(state = initialState, {type, payload}) {
  switch(type) {
  case ADD_TAG:
    return addTag(state, payload);
  case DELETE_TAG:
    return deleteTag(state, payload);
  default:
    return state;
  }
}
