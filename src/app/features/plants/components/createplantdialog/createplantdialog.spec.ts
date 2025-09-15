import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createplantdialog } from './createplantdialog';

describe('Createplantdialog', () => {
  let component: Createplantdialog;
  let fixture: ComponentFixture<Createplantdialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createplantdialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createplantdialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
