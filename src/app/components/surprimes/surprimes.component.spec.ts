import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurprimesComponent } from './surprimes.component';

describe('SurprimesComponent', () => {
  let component: SurprimesComponent;
  let fixture: ComponentFixture<SurprimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurprimesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurprimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
