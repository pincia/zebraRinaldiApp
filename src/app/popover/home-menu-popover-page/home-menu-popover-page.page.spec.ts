import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMenuPopoverPagePage } from './home-menu-popover-page.page';

describe('HomeMenuPopoverPagePage', () => {
  let component: HomeMenuPopoverPagePage;
  let fixture: ComponentFixture<HomeMenuPopoverPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMenuPopoverPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMenuPopoverPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
