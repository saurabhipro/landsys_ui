import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaymentAdvice, PaymentAdvice } from '../payment-advice.model';
import { PaymentAdviceService } from '../service/payment-advice.service';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { KhatedarService } from 'app/entities/khatedar/service/khatedar.service';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { LandCompensationService } from 'app/entities/land-compensation/service/land-compensation.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';
import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { ModalCitizenListComponent } from '../modal-citizen-list/modal-citizen-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-create-advise-custom.',
  templateUrl: './create-advise-custom.component.html',
})
export class CreatePaymentAdviceCustomComponent implements OnInit {
  isSaving = false;
  paymentAdviceTypeValues = Object.keys(PaymentAdviceType);
  paymentStatusValues = Object.keys(PaymentStatus);
  hissaTypeValues = Object.keys(HissaType);

  khatedarsCollection: IKhatedar[] = [];
  landCompensationsSharedCollection: ILandCompensation[] = [];
  projectLandsSharedCollection: IProjectLand[] = [];
  surveysSharedCollection: ISurvey[] = [];
  khatedars: any[] = [];
  landCompensation! : ILandCompensation;

  editForm = this.fb.group({
    id: [],
    accountHolderName: [null, [Validators.required]],
    accountHolderBankName: [null, [Validators.required]],
    paymentAmount: [null, [Validators.required]],
    bankName: [null, [Validators.required]],
    accountNumber: [null, [Validators.required]],
    ifscCode: [null, [Validators.required]],
    checkNumber: [],
    micrCode: [],
    paymentAdviceType: [],
    referenceNumber: [],
    paymentStatus: [null, [Validators.required]],
    hissaType: [null, [Validators.required]],
    khatedar: [null, Validators.required],
    landCompensation: [null, Validators.required],
    projectLand: [null, Validators.required],
    survey: [null, Validators.required],
    comments:[],
    photo:[],
    photoContentType:[]
  });

  constructor(
    protected paymentAdviceService: PaymentAdviceService,
    protected khatedarService: KhatedarService,
    protected landCompensationService: LandCompensationService,
    protected projectLandService: ProjectLandService,
    protected surveyService: SurveyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private modalService: NgbModal
    
  ) {}

  ngOnInit(): void {

   // combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
    //  const page = params.get('page');
    
    this.activatedRoute.data.subscribe(({ landCompensation }) => {
    
      // eslint-disable-next-line no-console
      console.log(landCompensation);
     this.landCompensation = landCompensation;
      const paymentAdvice: IPaymentAdvice = {
        survey :landCompensation.survey ,
        projectLand : landCompensation.projectLand,
        landCompensation
      }
      this.updateForm(paymentAdvice);

      this.loadRelationshipsOptions();
    });
   
      
     
    
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentAdvice = this.createFromForm();
    if (paymentAdvice.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentAdviceService.update(paymentAdvice));
    } else {
      this.subscribeToSaveResponse(this.paymentAdviceService.create(paymentAdvice));
    }
  }

  trackKhatedarById(_index: number, item: IKhatedar): number {
    return item.id!;
  }

  trackLandCompensationById(_index: number, item: ILandCompensation): number {
    return item.id!;
  }

  trackProjectLandById(_index: number, item: IProjectLand): number {
    return item.id!;
  }

  trackSurveyById(_index: number, item: ISurvey): number {
    return item.id!;
  }

  addCitizen(): void{
    const modalRef = this.modalService.open(ModalCitizenListComponent, { size: 'xl', backdropClass: 'light-blue-backdrop' });
    modalRef.componentInstance.multipleKhaterdars = this.editForm.get(['hissaType'])!.value  === 'SINGLE_OWNER' ? false : true;
    modalRef.result.then(res=>{
      const citizens =  res.citizens.filter((ct:any) => !(this.khatedars.some(kh=>kh.citizenId === ct.id )));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      citizens.forEach((ct:any) => {
       this.khatedars.push( {...ct,
          id: "",
          citizenId : ct.id,
          share:0,
          isPrimary:false

        })
      });

      if(this.khatedars.length>0 && this.editForm.get(['hissaType'])!.value  === 'SINGLE_OWNER'){
        this.khatedars[0].share = 100;
        this.khatedars[0].isPrimary = true;

        this.updatePrimary( this.khatedars[0].name, this.khatedars[0].accountNumber,  this.khatedars[0].bankBranch.ifsc,  this.khatedars[0].photo,  this.khatedars[0].photoContentType );
      }
      
    }).catch(err=>{
      console.log(err);
    })
 
   }

   removeKhatedar(index:number):void{
    if(this.khatedars[index].isPrimary){
      this.updatePrimary('', 0, '', '', '');

    }
    this.khatedars.splice(index,1);
   }

   onChangePrimary(khaterdar:any, index:number): void {
    this.updatePrimary(khaterdar.name, khaterdar.accountNumber,  khaterdar.bankBranch.ifsc, khaterdar.photo, khaterdar.photoContentType);
    this.khatedars[index].isPrimary = true;
    //
   }

   updatePrimary(name:string,accountNumber:number,ifscCode:string,photo:string, photoContentType:string ): void{

    this.editForm.patchValue({
       accountHolderName: name,
       accountNumber,
       ifscCode,
       photoContentType,
       photo
    })
   }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentAdvice>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(paymentAdvice: IPaymentAdvice): void {
    this.editForm.patchValue({
      id: paymentAdvice.id,
      accountHolderName: paymentAdvice.accountHolderName,
      accountHolderBankName: paymentAdvice.accountHolderBankName,
      paymentAmount: paymentAdvice.paymentAmount,
      bankName: paymentAdvice.bankName,
      accountNumber: paymentAdvice.accountNumber,
      ifscCode: paymentAdvice.ifscCode,
      checkNumber: paymentAdvice.checkNumber,
      micrCode: paymentAdvice.micrCode,
      paymentAdviceType: paymentAdvice.paymentAdviceType,
      referenceNumber: paymentAdvice.referenceNumber,
      paymentStatus: paymentAdvice.paymentStatus,
      hissaType: paymentAdvice.hissaType,
      khatedar: paymentAdvice.khatedar,
      landCompensation: paymentAdvice.landCompensation,
      projectLand: paymentAdvice.projectLand,
      survey: paymentAdvice.survey,
      comments:''
    });

    this.khatedarsCollection = this.khatedarService.addKhatedarToCollectionIfMissing(this.khatedarsCollection, paymentAdvice.khatedar);
    this.landCompensationsSharedCollection = this.landCompensationService.addLandCompensationToCollectionIfMissing(
      this.landCompensationsSharedCollection,
      paymentAdvice.landCompensation
    );
    this.projectLandsSharedCollection = this.projectLandService.addProjectLandToCollectionIfMissing(
      this.projectLandsSharedCollection,
      paymentAdvice.projectLand
    );
    this.surveysSharedCollection = this.surveyService.addSurveyToCollectionIfMissing(this.surveysSharedCollection, paymentAdvice.survey);
  }

  protected loadRelationshipsOptions(): void {
    this.khatedarService
      .query({ 'paymentAdviceId.specified': 'false' })
      .pipe(map((res: HttpResponse<IKhatedar[]>) => res.body ?? []))
      .pipe(
        map((khatedars: IKhatedar[]) =>
          this.khatedarService.addKhatedarToCollectionIfMissing(khatedars, this.editForm.get('khatedar')!.value)
        )
      )
      .subscribe((khatedars: IKhatedar[]) => (this.khatedarsCollection = khatedars));

    this.landCompensationService
      .query()
      .pipe(map((res: HttpResponse<ILandCompensation[]>) => res.body ?? []))
      .pipe(
        map((landCompensations: ILandCompensation[]) =>
          this.landCompensationService.addLandCompensationToCollectionIfMissing(
            landCompensations,
            this.editForm.get('landCompensation')!.value
          )
        )
      )
      .subscribe((landCompensations: ILandCompensation[]) => (this.landCompensationsSharedCollection = landCompensations));

    this.projectLandService
      .query()
      .pipe(map((res: HttpResponse<IProjectLand[]>) => res.body ?? []))
      .pipe(
        map((projectLands: IProjectLand[]) =>
          this.projectLandService.addProjectLandToCollectionIfMissing(projectLands, this.editForm.get('projectLand')!.value)
        )
      )
      .subscribe((projectLands: IProjectLand[]) => (this.projectLandsSharedCollection = projectLands));

    this.surveyService
      .query()
      .pipe(map((res: HttpResponse<ISurvey[]>) => res.body ?? []))
      .pipe(map((surveys: ISurvey[]) => this.surveyService.addSurveyToCollectionIfMissing(surveys, this.editForm.get('survey')!.value)))
      .subscribe((surveys: ISurvey[]) => (this.surveysSharedCollection = surveys));
  }

  protected createFromForm(): IPaymentAdvice {
    return {
      ...new PaymentAdvice(),
      id: this.editForm.get(['id'])!.value,
      accountHolderName: this.editForm.get(['accountHolderName'])!.value,
      accountHolderBankName: this.editForm.get(['accountHolderBankName'])!.value,
      paymentAmount: this.editForm.get(['paymentAmount'])!.value,
      bankName: this.editForm.get(['bankName'])!.value,
      accountNumber: this.editForm.get(['accountNumber'])!.value,
      ifscCode: this.editForm.get(['ifscCode'])!.value,
      checkNumber: this.editForm.get(['checkNumber'])!.value,
      micrCode: this.editForm.get(['micrCode'])!.value,
      paymentAdviceType: this.editForm.get(['paymentAdviceType'])!.value,
      referenceNumber: this.editForm.get(['referenceNumber'])!.value,
      paymentStatus: this.editForm.get(['paymentStatus'])!.value,
      hissaType: this.editForm.get(['hissaType'])!.value,
      khatedar: this.editForm.get(['khatedar'])!.value,
      landCompensation: this.editForm.get(['landCompensation'])!.value,
      projectLand: this.editForm.get(['projectLand'])!.value,
      survey: this.editForm.get(['survey'])!.value,
      comments:this.editForm.get(['comments'])!.value,
    };
  }
}
