import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  errorMessage!: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
  }

  get emailFormControl(): FormControl{
    return this.formGroup?.get('email') as FormControl;
  }
  get passwordFormControl(): FormControl{
    return this.formGroup?.get('password') as FormControl;
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(5),
        Validators.pattern(
          '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])')]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  onSubmit(type: string): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      console.log(this.formGroup);
      return;
    }

    if(type === 'User'){
      console.log(type);
      this.authService.login$(this.formGroup.value).subscribe({
        next: (response)=>{
          if(response){
            this.authService.storeUserData(response);
            this.router.navigate(['/home/jobs']);
          }
          else {
            this.errorMessage =
              "Wrong username or password! Would you like to create a new account?";
            // this.router.navigate(['/auth/register']);
          }
        }
      })
    }
    else {
      console.log(type);
      this.authService.loginAsOrganisation$(this.formGroup.value).subscribe({
        next: (response)=>{
          if(response){
            this.authService.storeOrganisationData(response);
            this.router.navigate(['home/jobs']);
          }
          else {
            this.errorMessage = 'Wrong username or password! Would you like to create a new account?'

            // this.router.navigate(['/auth/register']);
          }
        }
      })
    }

  }

}
