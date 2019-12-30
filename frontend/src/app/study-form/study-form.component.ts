import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api/api.service';
import { Study } from '../_models/study';
import { FormBuilder, Validators } from '@angular/forms';
import { Organization } from '../_models/organization';
import { Investigator } from '../_models/investigator';
import { Category } from '../_models/category';


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

  model: any = {};
  updatedModel: any = {};

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
    status: ['', Validators.required],
    coordinator_email: [''],
    eligibility_url: [''],
    image_url: [''],
    categories: [''],
    ages: [''],
  });

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getOrganizations();
    this.getInvestigators();
    this.getCategories();
  }

  ngOnInit() {
    this.loadData();
  }

  getOrganizations() {
    this.api.getOrganizations().subscribe( orgs => {
       return this.orgOptions = orgs;
      }
    )
  }

  getInvestigators() {
    this.api.getInvestigators().subscribe( invests => {
       return this.investOptions = invests;
      }
    )
  }

  getCategories() {
    this.api.getCategories().subscribe( cats => {
       return this.categoryOptions = cats;
      }
    )
  }

  loadData() {
    this.route.params.subscribe(params => {

      if (params['studyId']) {
        const studyId = params['studyId'];
        this.createNew = false;
        this.model.createNew = false;
        this.api.getStudy(studyId).subscribe(study => {
          this.study = study as Study;
          this.model = this.study;
          this.loadForm();
        });
      } else {
        this.createNew = true;
        this.model.createNew = true;
        this.study = {'title': '', 'description': '', 'participant_description': '', 'benefit_description': '',
          'investigators': [], 'location': '', 'categories': [], 'status': '' } as Study;
        this.loadForm();
      }
    });
  }

  loadForm() {
    this.studyForm.patchValue({
      title: this.study.title,
      short_title: this.study.short_title,
      description: this.study.description,
      short_description: this.study.short_description,
      participant_description: this.study.participant_description,
      benefit_description: this.study.benefit_description,
      investigators: this.study.investigators,
      organization: this.study.organization,
      location: this.study.location,
      status: this.statusOptions.find(opt => opt.value === this.study.status),
      coordinator_email: this.study.coordinator_email,
      eligibility_url: this.study.eligibility_url,
      image_url: this.study.image_url,
      categories: this.getStudyCategories(),
      ages: this.study.ages,
    });
    this.state = this.pageState.SHOW_FORM;

    console.log('this.studyForm', this.studyForm);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  getStudyCategories() {
    let categories = [];
    for (let i in this.study.study_categories) {
      categories.push(this.study.study_categories[i].category)
    }
    return categories;
  }

  addStudyCategories(study_id) {
    for (const cat in this.model.categories) {
      this.api.addStudyCategory({study_id: study_id, category_id: Number(cat)}).subscribe();
    }
  }

  submit() {
    console.log('here is the form on submit', this.studyForm);
  }

  addAndClose() {
    this.api.addStudy(this.model).subscribe(s =>
      {
        this.updatedStudy = s;
        this.addStudyCategories(s.id);
        this.close();
      });
  }

  updateAndClose() {
    this.api.updateStudy(this.updatedModel).subscribe( s =>
      {
        this.updatedStudy = s;
        this.close();
      });
  }

  showDelete() {
    this.showConfirmDelete = true;
  }

  onDelete() {
    this.api.deleteStudy(this.study).subscribe(r => {
      this.router.navigate(['studies']);
    })
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
