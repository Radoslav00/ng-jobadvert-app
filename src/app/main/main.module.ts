import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MainComponent} from "./main.component";
import {MainRoutingModule} from "./main-routing.module";
import {JobsComponent} from "../jobs/jobs.component";
import {JobItemComponent} from "../jobs/job-item/job-item.component";
import {JobReactiveFormComponent} from "../jobs/job-reactive-form/job-reactive-form.component";
import {JobInfoComponent} from "../jobs/job-info/job-info.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MainRoutingModule
  ],
  declarations: [
    MainComponent,
    JobsComponent,
    JobItemComponent,
    JobReactiveFormComponent,
    JobInfoComponent
  ]
})
export class MainModule{

}
