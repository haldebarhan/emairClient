import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyTableComponent } from './monthly-table.component';

describe('MonthlyTableComponent', () => {
  let component: MonthlyTableComponent;
  let fixture: ComponentFixture<MonthlyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
