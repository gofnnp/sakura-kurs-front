import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  of,
  exhaustMap,
  map,
  combineLatest,
} from 'rxjs';
import { WpJsonService } from 'src/app/services/wp-json.service';
import * as ConfigActions from './config.actions';

@Injectable()
export class ConfigEffects {
  getConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.getConfig),
      exhaustMap((action) =>
        combineLatest([
          this.wpJsonService.getSiteConfig(),
          this.wpJsonService.getSiteConfigFromIiko(),
        ]).pipe(
          map(([config, configFromIiko]) => {
            const allConfig = Object.assign(config.checkout, configFromIiko);
            return allConfig;
          }),
          map((allConfig) => {
            return {
              getSuccessResponse: {
                checkout: allConfig,
              },
            };
          }),
          map((value) => ConfigActions.getSuccess(value)),
          catchError((error) => of(ConfigActions.getFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private wpJsonService: WpJsonService
  ) {}
}
