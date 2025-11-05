import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFAQ } from './edit-faq';

describe('EditFAQ', () => {
  let component: EditFAQ;
  let fixture: ComponentFixture<EditFAQ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFAQ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFAQ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
