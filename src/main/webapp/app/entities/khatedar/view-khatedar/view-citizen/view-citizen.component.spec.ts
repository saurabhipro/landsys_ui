import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCitizenComponent } from './view-citizen.component';

describe('ViewCitizenComponent', () => {
  let component: ViewCitizenComponent;
  let fixture: ComponentFixture<ViewCitizenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCitizenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCitizenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
