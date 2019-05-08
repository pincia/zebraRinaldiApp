import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlslistPage } from './controlslist.page';

describe('ControlslistPage', () => {
  let component: ControlslistPage;
  let fixture: ComponentFixture<ControlslistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlslistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlslistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
