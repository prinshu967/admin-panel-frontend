import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCMS } from './add-cms';

describe('AddCMS', () => {
  let component: AddCMS;
  let fixture: ComponentFixture<AddCMS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCMS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCMS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
