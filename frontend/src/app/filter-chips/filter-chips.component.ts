import {Component, OnInit, Input} from '@angular/core';
import {StudyCategory} from '../_models/study_category';
import {ResourceCategory} from '../_models/resource_category';
import {AgeRange, Language, Covid19Categories} from '../_models/hit_type';

@Component({
  selector: 'app-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss']
})
export class FilterChipsComponent implements OnInit {
  @Input() categories: StudyCategory[] | ResourceCategory[] = [];
  @Input() ages: string[] = [];
  @Input() languages: string[] = [];
  @Input() covid19_categories: string[] = [];

  ageLabels = AgeRange.labels;
  languageLabels = Language.labels;
  covid19Labels = Covid19Categories.labels;

  constructor() {
  }

  ngOnInit() {
  }

}
