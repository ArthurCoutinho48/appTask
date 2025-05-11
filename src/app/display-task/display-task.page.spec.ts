import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayTaskPage } from './display-task.page';

describe('DisplayTaskPage', () => {
  let component: DisplayTaskPage;
  let fixture: ComponentFixture<DisplayTaskPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
