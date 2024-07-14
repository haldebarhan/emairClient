import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoEditComponent } from './conso-edit.component';

describe('ConsoEditComponent', () => {
  let component: ConsoEditComponent;
  let fixture: ComponentFixture<ConsoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
