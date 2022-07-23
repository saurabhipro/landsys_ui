import { Component, OnInit } from '@angular/core';
import { DataUtils, FileLoadError } from '../../../core/util/data-util.service';
import { ActivatedRoute } from '@angular/router';
import { Khatedar } from '../khatedar.model';
import { Citizen } from '../../citizen/citizen.model';
import { Land } from '../../land/land.model';
import { ProjectLand } from '../../project-land/project-land.model';
import { CitizenService } from '../../citizen/service/citizen.service';
import { LandService } from '../../land/service/land.service';
import { ProjectLandService } from '../../project-land/service/project-land.service';
import { EventManager, EventWithContent } from '../../../core/util/event-manager.service';
import { AlertError } from '../../../shared/alert/alert-error.model';
import { ISurvey, Survey } from '../../survey/survey.model';

interface Tab {
  index: number;
  name: string;
  title: string;
  tabClass: string;
  tabContentClass: string;
}

@Component({
  selector: 'jhi-view-khatedar',
  templateUrl: './view-khatedar.component.html',
  styleUrls: ['./view-khatedar.component.scss'],
})
export class ViewKhatedarComponent implements OnInit {
  citizen: Citizen = new Citizen();
  land: Land = new Land();
  projectLand: ProjectLand = new ProjectLand();
  khatedar: Khatedar = new Khatedar();
  tabs: Tab[] = [
    {
      index: 0,
      name: 'Khatedar',
      title: 'Khatedar',
      tabClass: 'nav-link active',
      tabContentClass: 'tab-pane fade show active',
    },
    // {
    //   index: 1,
    //   name: 'Land',
    //   title: 'Land Details',
    //   tabClass: 'nav-link',
    //   tabContentClass: 'tab-pane fade',
    // },
    {
      index: 1,
      name: 'Survey',
      title: 'Survey',
      tabClass: 'nav-link',
      tabContentClass: 'tab-pane fade',
    },
    {
      index: 2,
      name: 'Compensation',
      title: 'Compensation',
      tabClass: 'nav-link',
      tabContentClass: 'tab-pane fade',
    },
    {
      index: 3,
      name: 'Payment',
      title: 'Payment',
      tabClass: 'nav-link',
      tabContentClass: 'tab-pane fade',
    },
  ];
  selectedTab = this.tabs[0];
  survey!: ISurvey;

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected activatedRoute: ActivatedRoute,
    protected citizenService: CitizenService,
    protected landService: LandService,
    protected projectLandService: ProjectLandService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ khatedar }) => {
      this.khatedar = khatedar;

      this.citizenService.find(khatedar.citizen.id).subscribe(response => {
        this.khatedar.citizen = this.citizen = response.body as Citizen;
      });

      this.projectLandService.find(khatedar.projectLand.id).subscribe(response => {
        this.projectLand = this.khatedar.projectLand = response.body as ProjectLand;

        if (typeof this.projectLand.id === 'number') {
          this.projectLandService.getSurvey(this.projectLand.id).subscribe(
            (surveyResponse: any) => {
              if (surveyResponse.body) {
                this.survey = surveyResponse.body[0];
              }
            },
            err =>
              this.eventManager.broadcast(
                new EventWithContent<AlertError>('landsysUiApp.error', {
                  message: 'No Survey Found!',
                })
              )
          );
        }
        this.landService.find(response.body!.land!.id!).subscribe(res => {
          this.land = this.projectLand.land = this.khatedar.projectLand!.land = res.body as Land;
        });
      });
    });
  }

  selectTab(tab: Tab): void {
    this.tabs.forEach(currentTab => {
      currentTab.tabClass = 'nav-link';
      currentTab.tabContentClass = 'tab-pane fade';
    });
    tab.tabClass = 'nav-link active';
    tab.tabContentClass = 'tab-pane fade show active';
    this.selectedTab = tab;
  }

  gotoNext(): void {
    this.selectTab(this.tabs[(this.selectedTab.index + 1) % this.tabs.length]);
  }

  gotoPrevious(): void {
    this.selectTab(this.tabs[(this.selectedTab.index + this.tabs.length - 1) % this.tabs.length]);
  }
}
