import {CanLoad, Route, Router, UrlSegment, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";


@Injectable({
  providedIn: 'root'
})
export class LoginCanLoadGuard implements CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canLoad(route: Route, segments: UrlSegment[]):
    | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const response = this.authService.whoIsLoggedIn();

    if(response[0]===''){
      this.router.navigate(['/login']);
      return false;
    }
    console.log(response);
    return true;
  }
}
