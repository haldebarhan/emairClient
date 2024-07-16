import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurprimesFormComponent } from './surprimes-form.component';

describe('SurprimesFormComponent', () => {
  let component: SurprimesFormComponent;
  let fixture: ComponentFixture<SurprimesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurprimesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurprimesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
