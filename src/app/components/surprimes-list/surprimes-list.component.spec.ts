import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurprimesListComponent } from './surprimes-list.component';

describe('SurprimesListComponent', () => {
  let component: SurprimesListComponent;
  let fixture: ComponentFixture<SurprimesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurprimesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurprimesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
