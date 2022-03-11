import {Component, OnInit} from '@angular/core';
import {Job} from "./models/job.model";
import {JobsService} from "./services/jobs.service";
import {map, of, switchMap, take} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../auth/services/auth.service";
import {Organisation} from "../auth/models/organisation.model";
import {User} from "../auth/models/user.model";

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  errorMessage!: string;
  jobs!: Job[];
  job!: Job;
  id: number = 0;
  private user!: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobsService: JobsService,
    private authService: AuthService
  ) {


  }

  ngOnInit(): void {
    this.getContent();

    /*
    *
    *       filter pri podavane na promenliva ne raboti.. ne moga da otkriq prichinata
    *       pri hardcodenata stoinost ot naprimer 1, filtera raboti i se zapisvat samo oferti, koito sa applynati ot userID...
    *
     */
    this.route.params.pipe(
      map((params) => {
        if (params['id']) {
          let id: number = params['id'];
          console.log(params['id']);
          console.log(id);
          this.getFilteredContent(id);
          // return this.jobsService.getJobs$();
        }
      })
    ).subscribe({
      next: () => {
      }
    })

  }

  private getFilteredContent(userId: number) {
    this.jobsService.getJobs$().pipe(
      map((job) => {
        console.log(userId)
        return job.filter(j => j.applied?.includes(userId));
      }),
      take(1)
    ).subscribe({
      next: (response) => {
        console.log('filtered response from func'+JSON.stringify(response));
        this.jobs = response;
      }
    });
  }

  private getContent(): void {
    this.jobsService.getJobs$().pipe(
      take(1)
    ).subscribe({
      next: (response) => {
        console.log('stiga do tuk ponqkoe verme');
        this.jobs = response;

      },
      error: (response: HttpErrorResponse) => {
        this.errorMessage = response.message;
      }

    })
  }

  onCreateButtonClicked() {
    this.router.navigate(['/home', 'jobs', 'create']);
  }

  onJobEdit(jobId: number) {
    this.router.navigate(['/home', 'jobs', 'edit', jobId]);
  }

  onJobLiked(jobId: number): void {
    const response = this.authService.whoIsLoggedIn();
    if (response[0] === 'User') {
      const storageUser = JSON.parse(response[1]) as User; //retrieving user data from localstorage
      if (storageUser.id) { //checking if user.id is not null
        this.authService.getUserFromDB$(storageUser.id).pipe( //retrieving user from DB
          switchMap((response) => {
            if (response.jobsLiked?.includes(jobId)) {
              return this.authService.putUser$(response);
            } else {
              response.jobsLiked = response.jobsLiked || [];
              response.jobsLiked?.push(jobId);
              this.likeJob(jobId);
              return this.authService.putUser$(response);
            }
          }),
          take(1)
        ).subscribe();
      }
    }
  }

  likeJob(jobId: number): void {
    if (jobId) {
      this.jobsService.getJob$(jobId).pipe(
        switchMap((job) => {
          if (job.likes) {
            job.likes++;
          } else
            job.likes = 1;
          return this.jobsService.putJob$(job);
        }),
        take(1))
        .subscribe({
          next: (response) => {
            this.getContent();
          }
        });
    }
  }

  onJobApplied(job: Job) {
    const loggedInPerson = this.authService.whoIsLoggedIn();
    if (loggedInPerson[0] === 'Organisation') {
      return;
    }
    if (!loggedInPerson[1]) {
      return;
    }
    let userFromSystem = JSON.parse(loggedInPerson[1]) as User;
    if (userFromSystem.id) {
      this.authService.getUserFromDB$(userFromSystem.id).pipe(
        switchMap((user) => {
          if (user.id && job.id != null && !user.jobsApplied?.includes(job.id)) {
            user.jobsApplied = user.jobsApplied || [];
            user.jobsApplied?.push(job.id);
            this.applyJob(job.id, user.id);
            return this.authService.putUser$(user);
          }
          return of(null);
        }),
        take(1)
      ).subscribe({
        next: (response) => {
          if (response)
            console.log('applied');
        }
      });

    }
  }

  applyJob(jobId: number, userId: number) {
    this.jobsService.getJob$(jobId).pipe(
      switchMap((job) => {
        job.applied = job.applied || [];
        job.applied.push(userId);
        return this.jobsService.putJob$(job);
      }),
      take(1)
    ).subscribe({
      next: () => {
        console.log('apply registered in job data');
      }
    })
  }
}
