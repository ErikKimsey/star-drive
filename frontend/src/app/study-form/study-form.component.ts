import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../_services/api/api.service';
import {Study} from '../_models/study';
import {FormBuilder, Validators} from '@angular/forms';
import {Organization} from '../_models/organization';
import {Investigator} from '../_models/investigator';
import {Category} from '../_models/category';
import {StudyCategory} from '../_models/study_category';
import {StudyInvestigator} from '../_models/study_investigator';


enum PageState {
  LOADING = 'loading',
  SHOW_FORM = 'form',
}

@Component({
  selector: 'app-study-form',
  templateUrl: './study-form.component.html',
  styleUrls: ['./study-form.component.scss']
})
export class StudyFormComponent implements OnInit {
  study: Study;
  updatedStudy: Study;
  pageState = PageState;
  state = PageState.LOADING;
  showConfirmDelete = false;

  category: Category;

  statusOptions = [
    {'value': 'currently_enrolling', 'label': 'Currently Enrolling'},
    {'value': 'study_in_progress', 'label': 'Study in progress'},
    {'value': 'results_being_analyzed', 'label': 'Results being analyzed'},
    {'value': 'study_results_published', 'label': 'Study results published'}
  ];
  ageOptions = [
    {'value': 'pre-k', 'label': 'Pre-K (0 - 5 years)'},
    {'value': 'school', 'label': 'School age (6 - 13 years)'},
    {'value': 'transition', 'label': 'Transition age (14 - 22 years)'},
    {'value': 'adult', 'label': 'Adulthood (23 - 64)'},
    {'value': 'aging', 'label': 'Aging (65+)'}
  ];
  orgOptions: Organization[];
  investOptions: Investigator[];
  categoryOptions: Category[];

  createNew = false;

  studyForm = this.formBuilder.group({
    title: ['', Validators.required],
    short_title: ['', Validators.required],
    description: ['', Validators.required],
    short_description: ['', Validators.required],
    participant_description: ['', Validators.required],
    benefit_description: ['', Validators.required],
    investigators: [''],
    organization: [''],
    location: [''],
    num_visits: [''],
    status: ['', Validators.required],
    coordinator_email: [''],
    eligibility_url: [''],
    image_url: [''],
    categories: [''],
    ages: [''],
  });

  constructor(private api: ApiService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.getOrganizations();
    this.getInvestigators();
    this.getCategories();
  }

  ngOnInit() {
    this.loadData();
  }

  getOrganizations() {
    this.api.getOrganizations().subscribe(orgs => {
        return this.orgOptions = orgs;
      }
    );
  }

  getInvestigators() {
    this.api.getInvestigators().subscribe(invests => {
        return this.investOptions = invests;
      }
    );
  }

  getCategories() {
    this.api.getCategories().subscribe(cats => {
        return this.categoryOptions = cats;
      }
    );
  }

  loadData() {
    this.route.params.subscribe(params => {

      if (params['studyId']) {
        const studyId = params['studyId'];
        this.createNew = false;
        this.api.getStudy(studyId).subscribe(study => {
          this.study = study as Study;
          this.study.categories = [];
          this.study.study_categories.forEach(sc => {
            this.study.categories.push(sc.category);
          });
          this.study.investigators = [];
          this.study.study_investigators.forEach(si => {
            this.study.investigators.push(si.investigator);
          });
          this.loadForm();
        });
      } else {
        this.createNew = true;
        this.study = {
          'title': '', 'description': '', 'participant_description': '', 'benefit_description': '',
          'investigators': [], 'location': '', 'categories': [], 'status': ''
        } as Study;
        this.loadForm();
      }
    });
  }

  loadForm() {
    if (!this.createNew) {
      this.studyForm.setValue({
        title: this.study.title,
        short_title: this.study.short_title,
        description: this.study.description,
        short_description: this.study.short_description,
        participant_description: this.study.participant_description,
        benefit_description: this.study.benefit_description,
        investigators: this.study.investigators,
        organization: this.study.organization,
        location: this.study.location,
        num_visits: this.study.num_visits,
        status: this.study.status,
        coordinator_email: this.study.coordinator_email,
        eligibility_url: this.study.eligibility_url,
        image_url: this.study.image_url,
        categories: this.study.categories,
        ages: this.study.ages,
      });
    }
    this.state = this.pageState.SHOW_FORM;
  }

  compareFn(c1, c2): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  updateStudyCategories(study_id) {
    const selectedCategories: StudyCategory[] = [];

    this.studyForm.value.categories.forEach(cat => {
      selectedCategories.push({study_id: study_id, category_id: cat.id});
    });

    this.api.updateStudyCategories(study_id, selectedCategories).subscribe();
  }

  updateStudyInvestigators(study_id) {
    const selectedInvestigators: StudyInvestigator[] = [];

    this.studyForm.value.investigators.forEach(invest => {
      selectedInvestigators.push({study_id: study_id, investigator_id: invest.id});
    });

    this.api.updateStudyInvestigators(study_id, selectedInvestigators).subscribe();
  }

  submit() {
    this.updateStudy(() => this.saveAndClose());
  }

  updateStudy(callback: Function) {
    Object.keys(this.studyForm.value).forEach(val => {
      this.study[val] = this.studyForm.value[val];
    });
    this.study.organization_id = this.studyForm.value['organization'].id;
    callback();
  }

  saveAndClose() {
    const fnName = this.createNew ? 'addStudy' : 'updateStudy';
    this.api[fnName](this.study).subscribe(s => {
      this.updatedStudy = s;
      this.updateStudyCategories(s.id);
      this.updateStudyInvestigators(s.id);
      this.close();
    });
  }

  showDelete() {
    this.showConfirmDelete = true;
  }

  onDelete() {
    this.api.deleteStudy(this.study).subscribe(s => {
      this.router.navigate(['studies']);
    });
  }

  // Go to study screen
  close() {
    if (this.updatedStudy && this.updatedStudy.id) {
      this.router.navigate(['study', this.updatedStudy.id]);
    } else {
      this.router.navigate(['studies']);
    }
  }

  onCancel() {
    this.close();
  }
}
