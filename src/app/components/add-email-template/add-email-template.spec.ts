import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailTemplate } from './add-email-template';

describe('AddEmailTemplate', () => {
  let component: AddEmailTemplate;
  let fixture: ComponentFixture<AddEmailTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmailTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmailTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
