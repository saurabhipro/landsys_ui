import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewKhatedarComponent } from './view-khatedar.component';

describe('ViewKhatedarComponent', () => {
  let component: ViewKhatedarComponent;
  let fixture: ComponentFixture<ViewKhatedarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewKhatedarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewKhatedarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
