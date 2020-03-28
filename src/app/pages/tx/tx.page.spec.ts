import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxPage } from './tx.page';

describe('TxPage', () => {
  let component: TxPage;
  let fixture: ComponentFixture<TxPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
