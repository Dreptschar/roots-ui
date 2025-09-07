import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sensoroverview } from './sensoroverview';

describe('Sensoroverview', () => {
  let component: Sensoroverview;
  let fixture: ComponentFixture<Sensoroverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sensoroverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sensoroverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
