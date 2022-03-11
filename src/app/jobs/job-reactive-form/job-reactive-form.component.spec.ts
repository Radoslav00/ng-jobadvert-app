import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobReactiveFormComponent } from './job-reactive-form.component';

describe('JobReactiveFormComponent', () => {
  let component: JobReactiveFormComponent;
  let fixture: ComponentFixture<JobReactiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobReactiveFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
