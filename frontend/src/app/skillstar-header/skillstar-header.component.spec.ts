import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillstarHeaderComponent } from './skillstar-header.component';

describe('SkillstarHeaderComponent', () => {
  let component: SkillstarHeaderComponent;
  let fixture: ComponentFixture<SkillstarHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillstarHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillstarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
