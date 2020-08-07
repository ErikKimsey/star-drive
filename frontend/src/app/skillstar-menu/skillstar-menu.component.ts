import { Component, OnInit } from '@angular/core';
import {Participant} from '../_models/participant';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api/api.service';

@Component({
  selector: 'app-skillstar-menu',
  templateUrl: './skillstar-menu.component.html',
  styleUrls: ['./skillstar-menu.component.scss']
})
export class SkillStarMenuComponent implements OnInit {
  participant: Participant;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {
    this.route.params.subscribe(params => {
      this.api.getParticipant(parseInt(params.participantId, 10)).subscribe(participant => {
        this.participant = participant;
      });
    });
  }

  ngOnInit() {
  }

}
