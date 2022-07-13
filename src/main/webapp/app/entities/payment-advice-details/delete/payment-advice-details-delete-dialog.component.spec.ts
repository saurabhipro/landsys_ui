jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PaymentAdviceDetailsService } from '../service/payment-advice-details.service';

import { PaymentAdviceDetailsDeleteDialogComponent } from './payment-advice-details-delete-dialog.component';

describe('PaymentAdviceDetails Management Delete Component', () => {
  let comp: PaymentAdviceDetailsDeleteDialogComponent;
  let fixture: ComponentFixture<PaymentAdviceDetailsDeleteDialogComponent>;
  let service: PaymentAdviceDetailsService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PaymentAdviceDetailsDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(PaymentAdviceDetailsDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PaymentAdviceDetailsDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PaymentAdviceDetailsService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
