import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConfig } from './edit-config';

describe('EditConfig', () => {
  let component: EditConfig;
  let fixture: ComponentFixture<EditConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
