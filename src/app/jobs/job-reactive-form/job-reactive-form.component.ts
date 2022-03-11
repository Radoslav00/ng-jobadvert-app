import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {JobsService} from "../services/jobs.service";
import {Job} from "../models/job.model";
import {of, Subject, switchMap, takeUntil} from "rxjs";
import {AuthService} from "../../auth/services/auth.service";
import {Organisation} from "../../auth/models/organisation.model";

@Component({
  selector: 'app-job-reactive-form',
  templateUrl: './job-reactive-form.component.html',
  styleUrls: ['./job-reactive-form.component.scss']
})
export class JobReactiveFormComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  job: Job;
  destroy$ = new Subject<boolean>();

  @Output() deleteClicked: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private jobsService: JobsService,
    private authService: AuthService
  ) {
    this.job = {
      title: '',
      info: '',
      type: '',
      category: ''
    }
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params) => {
        if (params['id']) {
          return this.jobsService.getJob$(params['id']);
        }
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if (response) {
          this.job = response;
          this.initForm();
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      console.log(this.formGroup);
      this.formGroup.markAllAsTouched()

      return;
    }
    const creator = this.authService.whoIsLoggedIn()[1];
    if (!creator) {
      return;
    }
    let organisation = JSON.parse(creator) as Organisation;


    const job: Job = {
      id: this.job.id,
      title: this.formGroup.value.title,
      info: this.formGroup.value.info,
      type: this.formGroup.value.type,
      category: this.formGroup.value.category,
      likes: this.job.likes,
      createdBy: organisation.id
    };

    let request$;

    if (job.id) {
      request$ = this.jobsService.putJob$(job);
    } else {
      request$ = this.jobsService.postJob$(job);
    }

    request$.subscribe({
      next: () => {
        this.router.navigate(['/home/jobs']);
      }
    })

  }

  backButtonClicked() {
    this.router.navigate(['/home/jobs']);
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      title: [this.job.title, [Validators.required, Validators.minLength(5)]],
      info: [this.job.info, [Validators.required, Validators.minLength(5)]],
      type: [this.job.type, [Validators.required, Validators.minLength(5)]],
      category: [this.job.category, [Validators.required, Validators.minLength(5)]]
    })
  }

  onDeleteClicked(id: number) {
    this.jobsService.deleteJob$(id).subscribe({
      next: () => {
        this.router.navigate(['/jobs']);
      }
    })
  }

  get titleFormControl(): FormControl {
    return this.formGroup?.get('title') as FormControl;
  }

  get infoFormControl(): FormControl {
    return this.formGroup?.get('info') as FormControl;
  }

  get typeFormControl(): FormControl {
    return this.formGroup?.get('type') as FormControl;
  }

  get categoryFormControl(): FormControl {
    return this.formGroup?.get('category') as FormControl;
  }

}
