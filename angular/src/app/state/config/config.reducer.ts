import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { getConfig, getFailure, getSuccess } from './config.actions';

export interface ConfigState {
  checkout: any
}

export const initialConfigState: ConfigState = {
  checkout: null
};

const _configReducer = createReducer(
  initialConfigState,
  on(getSuccess, (state, { getSuccessResponse }) => {
    return getSuccessResponse;
  }),
  on(getFailure, (state, { error }) => {
    console.error(error);
    return state
  })
);

export function configReducer(state: any, action: any) {
  return _configReducer(state, action);
}

export const selectConfigState = createFeatureSelector<ConfigState>('config');

export const selectCheckout = createSelector(
  selectConfigState,
  (state) => {    
    return state.checkout
  }
);