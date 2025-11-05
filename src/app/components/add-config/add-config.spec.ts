import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConfig } from './add-config';

describe('AddConfig', () => {
  let component: AddConfig;
  let fixture: ComponentFixture<AddConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
