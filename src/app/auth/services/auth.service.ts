import {Injectable} from "@angular/core";
import {delay, map, Observable, of} from "rxjs";
import {Login} from "../models/login.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {User} from "../models/user.model";
import {Organisation} from "../models/organisation.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = `${environment.apiUrl}/users`;
  private urlOrg = `${environment.apiUrl}/organisations`;

  constructor(
    private http: HttpClient
  ) {
  }
  getUserFromDB$(id: number): Observable<User> {
    const url = `${this.url}/${id}`;

    return this.http.get<User>(url);
  }
  getOrgFromDB$(id: number): Observable<Organisation> {
    const url = `${this.urlOrg}/${id}`;

    return this.http.get<Organisation>(url);
  }

  postUser$(user: User): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  putUser$(user: User): Observable<User> {
    const url = `${this.url}/${user.id}`;
    return this.http.put<User>(url, user);
  }

  putOrganisation$(organisation: Organisation): Observable<Organisation> {
    const urlOrg = `${this.urlOrg}/${organisation.id}`;
    return this.http.put<Organisation>(urlOrg, organisation);
  }

  postOrganisation$(organisation: Organisation): Observable<Organisation> {
    return this.http.post<Organisation>(this.urlOrg, organisation);
  }

  login$(data: Login) {
    return this.http.get<User[]>(this.url).pipe(
      map((response) => {
        const user = response.find(u => u.email === data.email && u.password === data.password)

        if (user)
          return user;
        return null;
      })
    );
  }

  loginAsOrganisation$(data: Login) {
    return this.http.get<Organisation[]>(this.urlOrg).pipe(
      map((response) => {
        const organisation = response.find(o => o.email === data.email && o.password === data.password)

        if (organisation)
          return organisation;
        return null;
      })
    );
  }

  storeUserData(user: User): void {
    delete user.password;
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  storeOrganisationData(organisation: Organisation) {
    delete organisation.password;
    localStorage.setItem('loggedOrganisation', JSON.stringify(organisation));
  }

  logout(): void {
    localStorage.clear();
  }

  whoIsLoggedIn(): string[] {
    if (localStorage.getItem('loggedUser')) {
      const user: string[] = ['User', localStorage.getItem('loggedUser') || ''];

      return user;
    } else if (localStorage.getItem('loggedOrganisation')) {
      const organisation: string[] = ['Organisation', localStorage.getItem('loggedOrganisation') || '']
      return organisation;
    }
    return [''];
  }







  /*
    getUserFromStorage(): User {
        const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');

        return user;
      }*/
}





















