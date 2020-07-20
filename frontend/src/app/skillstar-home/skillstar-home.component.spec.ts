import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillstarHomeComponent } from './skillstar-home.component';

describe('SkillstarHomeComponent', () => {
  let component: SkillstarHomeComponent;
  let fixture: ComponentFixture<SkillstarHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillstarHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillstarHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
