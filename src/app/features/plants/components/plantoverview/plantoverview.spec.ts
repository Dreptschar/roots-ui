import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Plantoverview } from './plantoverview';

describe('Plantoverview', () => {
  let component: Plantoverview;
  let fixture: ComponentFixture<Plantoverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Plantoverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Plantoverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
