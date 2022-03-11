import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from "../models/job.model";

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss']
})
export class JobItemComponent implements OnInit {
  @Input() job!: Job;


  @Output() jobEdit: EventEmitter<number> = new EventEmitter<number>();
  @Output() jobLiked: EventEmitter<number> = new EventEmitter<number>();
  @Output() jobApplied: EventEmitter<Job> = new EventEmitter<Job>();



  constructor() { }

  ngOnInit(): void {
  }

  onEdit() {
    this.jobEdit.emit(this.job.id);
  }

  onJobLiked() {
    this.jobLiked.emit(this.job.id);
  }

  onApply() {
    this.jobApplied.emit(this.job);
  }
}
