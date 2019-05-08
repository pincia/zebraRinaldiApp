import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaricoModalPage } from './carico-modal.page';

describe('CaricoModalPage', () => {
  let component: CaricoModalPage;
  let fixture: ComponentFixture<CaricoModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaricoModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaricoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
