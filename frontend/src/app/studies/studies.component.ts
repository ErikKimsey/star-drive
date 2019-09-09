import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import {Query, HitLabel, HitType} from '../_models/query';

@Component({
  selector: 'app-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit {
  query: Query;

  constructor(private api: ApiService) {
    this.loadStudies();
  }

  ngOnInit() {
  }

  loadStudies() {
    const query = new Query({
      filters: [{field: 'type', value: [HitType.STUDY]}]
    });
    this.api.search(query).subscribe(q => this.query = new Query(q));
  }

}
