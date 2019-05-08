import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckproductPage } from './checkproduct.page';

describe('CheckproductPage', () => {
  let component: CheckproductPage;
  let fixture: ComponentFixture<CheckproductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckproductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
