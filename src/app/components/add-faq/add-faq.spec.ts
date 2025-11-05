import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFAQ } from './add-faq';

describe('AddFAQ', () => {
  let component: AddFAQ;
  let fixture: ComponentFixture<AddFAQ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFAQ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFAQ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
