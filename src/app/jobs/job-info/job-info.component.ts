import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {JobsService} from "../services/jobs.service";
import {AuthService} from "../../auth/services/auth.service";
import {of, Subject, switchMap, takeUntil} from "rxjs";
import {Job} from "../models/job.model";

@Component({
  selector: 'app-job-info',
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.scss']
})
export class JobInfoComponent implements OnInit, OnDestroy {
  job!: Job;
  destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobsService: JobsService,
    private authService: AuthService
  ) {
    this.job = {
      title: '',
      info: ''
    }
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params)=>{
        if (params['id']) {
          return this.jobsService.getJob$(params['id']);
        }
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) =>{
        if(response){
          this.job = response;
        }
      }
    })

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  editClicked() {
      this.router.navigate(['/home','jobs', 'edit', this.job.id]);
  }



  backClicked() {
    this.router.navigate(['/home/jobs']);
  }
}
