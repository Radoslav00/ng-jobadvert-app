import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MainComponent} from "./main.component";
import {JobsComponent} from "../jobs/jobs.component";
import {JobReactiveFormComponent} from "../jobs/job-reactive-form/job-reactive-form.component";
import {ActivateGuardGuard} from "../auth/guards/activate-guard.guard";
import {JobInfoComponent} from "../jobs/job-info/job-info.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'jobs',
        component: JobsComponent
      },
      {
        path: 'jobs/create',
        component: JobReactiveFormComponent,
        canActivate: [ActivateGuardGuard]
      },
      {
        path: 'jobs/edit/:id',
        component: JobReactiveFormComponent,
        canActivate: [ActivateGuardGuard]
      },
      {
        path: 'jobs/info/:id',
        component: JobInfoComponent
      },
      {
        path: 'jobs/applied/:id',
        component: JobsComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'jobs'
      }
    ]
  },

]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingModule {

}
