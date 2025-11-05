import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailTemplate } from './edit-email-template';

describe('EditEmailTemplate', () => {
  let component: EditEmailTemplate;
  let fixture: ComponentFixture<EditEmailTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmailTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmailTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
