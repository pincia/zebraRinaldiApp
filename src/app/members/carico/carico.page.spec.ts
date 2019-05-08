import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaricoPage } from './carico.page';

describe('CaricoPage', () => {
  let component: CaricoPage;
  let fixture: ComponentFixture<CaricoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaricoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaricoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
