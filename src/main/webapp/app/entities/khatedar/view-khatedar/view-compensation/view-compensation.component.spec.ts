import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompensationComponent } from './view-compensation.component';

describe('ViewCompensationComponent', () => {
  let component: ViewCompensationComponent;
  let fixture: ComponentFixture<ViewCompensationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCompensationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompensationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
