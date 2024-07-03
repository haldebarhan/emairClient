import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDenreeComponent } from './edit-denree.component';

describe('EditDenreeComponent', () => {
  let component: EditDenreeComponent;
  let fixture: ComponentFixture<EditDenreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDenreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDenreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
