import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoDetailComponent } from './conso-detail.component';

describe('ConsoDetailComponent', () => {
  let component: ConsoDetailComponent;
  let fixture: ComponentFixture<ConsoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
