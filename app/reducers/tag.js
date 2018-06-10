import {
  ADD_TAG,
  DELETE_TAG,
  TOGGLE_DIALOG,
} from './../actions/tag.js';

const initialState = {
  tags: {},
  dialogIsOpen: false,
};

function addTag(state, {filePath, tag}) {
  tag = tag.replace("/", "");

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
  const tags = {
    ...state.tags,
    [tag]: state.tags[tag].filter((e) => e !== filePath),
  };
  const newTags = Object.keys(tags).reduce((a, key) => {
    if (tags[key].length > 0) {
      a[key] = tags[key];
      return a;
    }
    return a;
  }, {});

  return {
    ...state,
    tags: newTags,
  };
}

export default function(state = initialState, {type, payload}) {
  switch(type) {
  case ADD_TAG:
    return addTag(state, payload);
  case DELETE_TAG:
    return deleteTag(state, payload);
  case TOGGLE_DIALOG:
    return ({
      ...state,
      dialogIsOpen: !state.dialogIsOpen,
    });
  default:
    return state;
  }
}
