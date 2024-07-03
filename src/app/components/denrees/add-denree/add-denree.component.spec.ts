import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDenreeComponent } from './add-denree.component';

describe('AddDenreeComponent', () => {
  let component: AddDenreeComponent;
  let fixture: ComponentFixture<AddDenreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDenreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDenreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
