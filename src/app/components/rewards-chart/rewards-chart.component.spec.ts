import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsChartComponent } from './rewards-chart.component';

describe('NodeSliderComponent', () => {
  let component: RewardsChartComponent;
  let fixture: ComponentFixture<RewardsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardsChartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
