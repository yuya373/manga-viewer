import { Actions } from '../actions';
import { Types } from '../actions/types';

export type HitomiState = {
  url: string;
  isScraping: { [url: string]: boolean };
};

const initialState: HitomiState = {
  url: '',
  isScraping: {},
};

function setIsScraping(
  state: HitomiState = initialState,
  url: string,
  value: boolean
): HitomiState {
  const isScraping = { ...state.isScraping };

  if (value) {
    isScraping[url] = true;
  } else {
    delete isScraping[url];
  }

  return {
    ...state,
    isScraping,
  };
}

export default function(
  state: HitomiState = initialState,
  action: Actions
): HitomiState {
  switch (action.type) {
    case Types.HITOMI_URL_CHANGED:
      return {
        ...state,
        url: action.payload.url,
      };
    case Types.HITOMI_SCRAPE_STARTED:
      return setIsScraping(
        {
          ...state,
          url: '',
        },
        action.payload.url,
        true
      );
    case Types.HITOMI_SCRAPE_DONE:
    case Types.HITOMI_SCRAPE_FAILED:
      return setIsScraping(state, action.payload.url, false);
    default:
      return state;
  }
}
