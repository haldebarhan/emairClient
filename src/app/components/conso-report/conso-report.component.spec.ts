import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoReportComponent } from './conso-report.component';

describe('ConsoReportComponent', () => {
  let component: ConsoReportComponent;
  let fixture: ComponentFixture<ConsoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
