import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, of, exhaustMap, map, tap } from "rxjs";
import { WpJsonService } from "src/app/services/wp-json.service";
import * as ConfigActions from './config.actions';


@Injectable()
export class ConfigEffects {
    getConfig$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ConfigActions.getConfig),
            exhaustMap((action) =>
                this.wpJsonService.getSiteConfig()
                    .pipe(
                        map((getSuccessResponse) => {                            
                            return ConfigActions.getSuccess({ getSuccessResponse })
                        }
                        ),
                        catchError((error) => of(ConfigActions.getFailure({ error })))
                    )
            )
        )
    )

    constructor(
        private actions$: Actions,
        private wpJsonService: WpJsonService,
    ) { }

}