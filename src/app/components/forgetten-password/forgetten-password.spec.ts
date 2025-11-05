import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgettenPassword } from './forgetten-password';

describe('ForgettenPassword', () => {
  let component: ForgettenPassword;
  let fixture: ComponentFixture<ForgettenPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgettenPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgettenPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
