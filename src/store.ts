import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { load } from './actions/store';

const isProduction = process.env.NODE_ENV === 'production';
const composeEnhancers = isProduction
  ? compose
  : (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  load(),
  composeEnhancers(applyMiddleware(thunk))
);
