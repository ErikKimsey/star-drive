import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillStarMenuComponent } from './skillstar-menu.component';

describe('SkillStarMenuComponent', () => {
  let component: SkillStarMenuComponent;
  let fixture: ComponentFixture<SkillStarMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillStarMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillStarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
