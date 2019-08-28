import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-details-link',
  templateUrl: './details-link.component.html',
  styleUrls: ['./details-link.component.scss']
})
export class DetailsLinkComponent implements OnInit {
  @Input() url: string;
  @Input() label = 'Details';
  @Input() size = 1;
  @Input() hover = false;
  @Input() selected = false;
  @Input() subtitle = '';

  constructor() { }

  ngOnInit() {
  }

}
