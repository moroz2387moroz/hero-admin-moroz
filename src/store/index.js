import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import heroes from "../reducers/heroes";
import filters from "../reducers/filters";

const stringMiddleware = () => (next) => (action) => {
  if (typeof action === "string") {
    return next({
      type: action,
    });
  }
  return next(action);
};

const middlewareEnhancer = applyMiddleware(thunk, stringMiddleware);
const devToolsEnhancer =
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__();
const enhancer = devToolsEnhancer
  ? compose(middlewareEnhancer, devToolsEnhancer)
  : middlewareEnhancer;

const store = createStore(
  combineReducers({ heroes, filters }),
  enhancer,
);

export default store;
