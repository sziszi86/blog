import {
  Injectable
} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {
  Observable
} from 'rxjs';
import {
  AuthService
} from '../services/auth.service';
import {
  map
} from 'rxjs/operators';
import {
  AppUser
} from '../models/appuser';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class AdminAuthGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable < boolean | UrlTree > | Promise < boolean | UrlTree > | boolean | UrlTree {
    return this.authService.appUser$.pipe(map((user: AppUser) => {
      if (user && user.isAdmin) {
        return true;
      }
      this.router.navigate(['/'], {
        queryParams: {
          returnUrl: state.url
        }
      });
      return false;
    }));
  }

  constructor(private router: Router, private authService: AuthService) {}
}
