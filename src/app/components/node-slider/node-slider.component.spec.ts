import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSliderComponent } from './node-slider.component';

describe('NodeSliderComponent', () => {
  let component: NodeSliderComponent;
  let fixture: ComponentFixture<NodeSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeSliderComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
