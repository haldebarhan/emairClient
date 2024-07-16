import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiversFormComponent } from './divers-form.component';

describe('DiversFormComponent', () => {
  let component: DiversFormComponent;
  let fixture: ComponentFixture<DiversFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiversFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiversFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
