import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {User} from "../models/user.model";
import {of, Subject, switchMap, takeUntil} from "rxjs";
import {Organisation} from "../models/organisation.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  user!: User;
  org!: Organisation;
  loggedUser = this.isUserLoggedIn();


  destroy$ = new Subject<boolean>()

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.user = {
      name: '',
      email: '',
      password: ''
    };
    this.org = {
      name: '',
      email: '',
      password: ''
    };

    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {

    this.route.params.pipe(
      switchMap((params) => {
        if (params['id']) {
          if (this.loggedUser === 'User') {
            return this.authService.getUserFromDB$(params['id']);
          }
          if (this.loggedUser === 'Organisation') {
            return this.authService.getOrgFromDB$(params['id']);
          }
        }
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if (response) {
          if (this.loggedUser === 'User')
            this.user = response;
          else
            this.org = response;

          this.initForm();
        }
      }
    })

  }

  get emailFormControl(): FormControl {
    return this.formGroup?.get('email') as FormControl;
  }

  get passwordFormControl(): FormControl {
    return this.formGroup?.get('password') as FormControl;
  }

  get nameFormControl(): FormControl {
    return this.formGroup?.get('name') as FormControl;
  }


  onSubmit(type: string) {

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }


    if (type === 'User')
      this.editUser();
    else
      this.editOrganisation();


  }

  private initForm() {
    if (this.loggedUser === 'User') {
      this.formGroup = this.formBuilder.group({
        name: [this.user.name, [Validators.required, Validators.minLength(5)]],
        email: [this.user.email, [Validators.required, Validators.minLength(5),
          Validators.pattern('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])')]],
        password: [this.user.password, [Validators.required, Validators.minLength(5)]]
      })
    } else {
      this.formGroup = this.formBuilder.group({
        name: [this.org.name, [Validators.required, Validators.minLength(5)]],
        email: [this.org.email, [Validators.required, Validators.minLength(5),
          Validators.pattern('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])')]],
        password: [this.org.password, [Validators.required, Validators.minLength(5)]]
      })
    }

  }

  isUserLoggedIn(): String {
    if (localStorage.getItem('loggedUser'))
      return 'User';
    else if (localStorage.getItem('loggedOrganisation'))
      return 'Organisation';
    return '';
  }

  private editUser() {
    const user: User = {
      id: this.user.id,
      name: this.formGroup.value.name,
      email: this.formGroup.value.email,
      password: this.formGroup.value.password
    }
    let request$;
    if (user.id) {
      request$ = this.authService.putUser$(user);
    } else {
      request$ = this.authService.postUser$(user);
    }

    request$.subscribe({
      next: () => {
        this.router.navigate(['/jobs']);
      }
    });
  }

  private editOrganisation() {
    const organisation: Organisation = {
      id: this.org.id,
      name: this.formGroup.value.name,
      email: this.formGroup.value.email,
      password: this.formGroup.value.password
    }
    let requestForOrg$;
    if (organisation.id) {
      requestForOrg$ = this.authService.putOrganisation$(organisation);
    } else {
      requestForOrg$ = this.authService.postOrganisation$(organisation);
    }

    requestForOrg$.subscribe({
      next: () => {
        this.router.navigate(['/jobs']);
      }
    });
  }
  backButtonClicked() {
    this.router.navigate(['/home/jobs']);
  }
}
