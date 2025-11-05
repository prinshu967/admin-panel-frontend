import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCMS } from './edit-cms';

describe('EditCMS', () => {
  let component: EditCMS;
  let fixture: ComponentFixture<EditCMS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCMS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCMS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
