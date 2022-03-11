import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/services/auth.service";
import {Router} from "@angular/router";
import {User} from "../auth/models/user.model";
import {Organisation} from "../auth/models/organisation.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {

  }

  isUserLoggedIn(): string {
    if (localStorage.getItem('loggedUser'))
      return 'User';
    else if (localStorage.getItem('loggedOrganisation'))
      return 'Organisation';
    return '';
  }

  logOut() {
    this.authService.logout();
    window.location.reload();
  }
  getLoggedUserName(): string {
    let user = this.authService.whoIsLoggedIn();
    if (!user[1])
      return '';
    if (user[0] === 'User') {
      let userObject = JSON.parse(user[1]) as User;
      return userObject.name;
    }
    else {
      let userObject = JSON.parse(user[1]) as Organisation;
      return userObject.name;
    }
  }

  getUserId(): number{
    let user = this.authService.whoIsLoggedIn()[1];
    if(user){
      let userObject = JSON.parse(user);
      return userObject.id;
    }
    return 0;
  }

  editUser() {
    let loggedIn = this.authService.whoIsLoggedIn();
    if (loggedIn[0] === 'User') {
      let user = JSON.parse(loggedIn[1]) as User;
      this.router.navigate(['/register', user.id]);
    } else {
      let org = JSON.parse(loggedIn[1]) as Organisation;
      this.router.navigate(['/register', org.id]);
    }
  }


}
