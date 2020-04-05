import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, PageFixture, TestBed } from '@angular/core/testing';

import { Tabs } from './tabs.page';

describe('TabsPage', () => {
  let page: TabsPage;
  let fixture: PageFixture<TabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compilePages();
  }));

  beforeEach(() => {
    fixture = TestBed.createPage(TabsPage);
    page = fixture.pageInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(page).toBeTruthy();
  });
});