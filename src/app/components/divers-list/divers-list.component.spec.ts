import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiversListComponent } from './divers-list.component';

describe('DiversListComponent', () => {
  let component: DiversListComponent;
  let fixture: ComponentFixture<DiversListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiversListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiversListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
