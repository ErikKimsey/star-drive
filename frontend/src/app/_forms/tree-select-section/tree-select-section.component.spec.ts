import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeSelectSectionComponent } from './tree-select-section.component';

describe('TreeSelectSectionComponent', () => {
  let component: TreeSelectSectionComponent;
  let fixture: ComponentFixture<TreeSelectSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeSelectSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeSelectSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
