import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import { Resource } from '../_models/resource';
import { Query, Hit } from '../_models/query';
import { LatLngLiteral } from '@agm/core';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  query: Query;
  mapLoc: LatLngLiteral = {
    lat: 37.9864031,
    lng: -81.6645856
  };

  constructor(
    private api: ApiService
  ) {
    this.loadResources();
    this.loadMapLocation();
  }

  ngOnInit() {
  }

  loadMapLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(p => {
        this.mapLoc.lat = p.coords.latitude;
        this.mapLoc.lng = p.coords.longitude;
      });
    }
  }

  loadResources() {
    const query = new Query({
      filters: [{field: 'Type', value: 'RESOURCE'}]
    });
    this.api.search(query).subscribe(q => this.query = q);
  }

}
