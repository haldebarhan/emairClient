import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetteEditComponent } from './recette-edit.component';

describe('RecetteEditComponent', () => {
  let component: RecetteEditComponent;
  let fixture: ComponentFixture<RecetteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetteEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
