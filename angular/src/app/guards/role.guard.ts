import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, lastValueFrom } from 'rxjs';
import { ApiService } from '../services/api.service';
import { CookiesService } from '../services/cookies.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private api: ApiService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if ((await lastValueFrom(this.api.getUser())).role_name === 'ADMIN') {
      return true
    } else {
      this.router.navigateByUrl('/products');
      return false
    }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.canActivate(next, state);
  }
}
