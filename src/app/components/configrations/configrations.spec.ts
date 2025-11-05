import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Configrations } from './configrations';

describe('Configrations', () => {
  let component: Configrations;
  let fixture: ComponentFixture<Configrations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Configrations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Configrations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
