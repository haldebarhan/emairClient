import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookletComponent } from './booklet.component';

describe('BookletComponent', () => {
  let component: BookletComponent;
  let fixture: ComponentFixture<BookletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
