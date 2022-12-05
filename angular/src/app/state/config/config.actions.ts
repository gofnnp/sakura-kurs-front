import { createAction, props } from '@ngrx/store';

export const getConfig = createAction('[Config] Get');

export const getSuccess = createAction(
    '[Config] Get Success',
    props<{ getSuccessResponse: any }>()
);

export const getFailure = createAction(
  '[Config] Get Failure',
  props<{ error: string }>()
);