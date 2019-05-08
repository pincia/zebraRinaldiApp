import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLogoutPage } from './auto-logout.page';

describe('AutoLogoutPage', () => {
  let component: AutoLogoutPage;
  let fixture: ComponentFixture<AutoLogoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLogoutPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLogoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
