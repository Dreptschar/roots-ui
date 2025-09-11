import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Plantsoverview } from './plantsoverview';

describe('Plantsoverview', () => {
  let component: Plantsoverview;
  let fixture: ComponentFixture<Plantsoverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Plantsoverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Plantsoverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
