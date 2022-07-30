import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Form11Service } from '../service/form-11.service';

import { Form11Component } from './form-11.component';

describe('Form11 Management Component', () => {
  let comp: Form11Component;
  let fixture: ComponentFixture<Form11Component>;
  let service: Form11Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Form11Component],
    })
      .overrideTemplate(Form11Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Form11Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Form11Service);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.form11s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
