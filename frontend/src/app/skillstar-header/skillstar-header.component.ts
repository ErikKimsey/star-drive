import {Component, Input, OnInit} from '@angular/core';
import {Participant} from '../_models/participant';

@Component({
  selector: 'app-skillstar-header',
  templateUrl: './skillstar-header.component.html',
  styleUrls: ['./skillstar-header.component.scss']
})
export class SkillstarHeaderComponent implements OnInit {
  @Input() participant: Participant;

  constructor() { }

  ngOnInit() {
  }

}
