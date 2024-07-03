import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenreeListComponent } from './denree-list.component';

describe('DenreeListComponent', () => {
  let component: DenreeListComponent;
  let fixture: ComponentFixture<DenreeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DenreeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DenreeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
