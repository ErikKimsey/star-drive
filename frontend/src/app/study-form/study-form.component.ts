import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api/api.service';
import { Study } from '../_models/study';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Organization } from '../_models/organization';
import { Investigator } from '../_models/investigator';


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
  // form: FormGroup;
  studyForm: FormGroup;

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

  createNew = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.getOrganizations();
    this.getInvestigators();
  }

  ngOnInit() {
    // this.model.createNew = false;
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
  //
  // filterOrganizations(name: string): Organization[] {
  //   return this.orgOptions.filter(org =>
  //     org.name.toLowerCase().includes(name.toLowerCase())
  //   )
  // }

  loadData() {
    this.route.params.subscribe(params => {

      if (params['studyId']) {
        const studyId = params['studyId'];
        this.createNew = false;
        this.model.createNew = false;
        this.api.getStudy(studyId).subscribe(study => {
          this.study = study as Study;
          this.model = this.study;
          this.loadStudyInvestigators(study);
          this.loadStudyCategories(study, () => this.loadForm());
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

  loadStudyCategories(study: Study, callback: Function) {
    this.model.categories = [];
    if (study.study_categories.length > 0) {
      for (const cat in study.study_categories) {
        this.model.categories[study.study_categories[cat].category.id] = true;
        callback();
      }
    } else {
      callback();
    }
  }

  loadStudyInvestigators(study: Study) {
    this.model.investigators = [];
    if (study.study_investigators.length > 0) {
      for (const i in study.study_investigators) {
        this.model.investigators.push(study.study_investigators[i].investigator);
      }
    }
  }

  loadForm() {
    // this.form = new FormGroup({});

    this.studyForm = this.formBuilder.group({
      title: [this.study.title],
      short_title: [this.study.short_title],
      description: [this.study.description],
      short_description: [this.study.short_description],
      participant_description: [this.study.participant_description],
      benefit_description: [this.study.benefit_description],
      investigators: [this.study.investigators],
      organization: [this.study.organization],
      location: [this.study.location],
      status: [this.study.status],
      coordinator_email: [this.study.coordinator_email],
      eligibility_url: [this.study.eligibility_url],
      categories: [this.study.categories],
      ages: [this.study.ages],
    });
    console.log('studyForm', this.studyForm);
    // this.options = {
    //   formState: {
    //     mainModel: this.model
    //   }
    // };
    this.state = this.pageState.SHOW_FORM;
  }

  updateRelatedModel(model_name, model_name_plural) {
    const join_name = 'study_' + model_name_plural;
    const api_name = 'Study' + model_name.charAt(0).toUpperCase() + model_name.slice(1);
    const model_id = model_name + '_id';
    const relModIds = this.study[join_name].map(relMod => relMod[model_name].id);
    // Add the new related models
    for (const relMod in this.model[model_name_plural]) {
      if (!relModIds.includes(Number(relMod))) {
        this.api[`add${api_name}`]({"study_id": this.study.id, model_id: Number(relMod)}).subscribe();
      }
    }
    // Remove any deleted related models
    for (const relMod in this.study[join_name]) {
      if (!this.model[model_name_plural][this.study[join_name][relMod][model_id]]) {
        this.api[`delete${api_name}`](this.study[join_name][relMod]).subscribe();
      }
    }
  }

  updateStudyCategories() {
    const scIds = this.study.study_categories.map(sc => sc.category.id);
    // Add the new categories
    for (const cat in this.model.categories) {
      if (!scIds.includes(Number(cat))) {
        this.api.addStudyCategory({study_id: this.study.id, category_id: Number(cat)}).subscribe();
      }
    }
    // Remove any deleted categories
    for (const sc in this.study.study_categories) {
      if (!this.model.categories[this.study.study_categories[sc].category_id]) {
        this.api.deleteStudyCategory(this.study.study_categories[sc]).subscribe();
      }
    }
  }

  addStudyCategories(study_id) {
    for (const cat in this.model.categories) {
      this.api.addStudyCategory({study_id: study_id, category_id: Number(cat)}).subscribe();
    }
  }

  updateStudyInvestigators() {
    const siIds = this.study.study_investigators.map(si => si.investigator.id);
    // Add the new investigators
    for (const invest in this.model.investigators) {
      if (!siIds.includes(Number(invest))) {
        this.api.addStudyInvestigator({study_id: this.study.id, investigator_id: Number(invest)}).subscribe();
      }
    }
    // Remove any deleted investigators
    for (const si in this.study.study_investigators) {
      if (!this.model.investigators[this.study.study_investigators[si].investigator_id]) {
        this.api.deleteStudyInvestigator(this.study.study_investigators[si]).subscribe();
      }
    }
  }

  updateOrganization(callback: Function) {
    // If the user selects an existing Organization name from the list, it will be saved as an Organization object. If they write in their
    // own Organization name, it will be saved as a new organization with that name. When saving a new organization, we also create an
    // updated model so that we don't accidentally save the old version before it's updated. When there is no Organization being saved, all
    // we do is create the updated model.
    if (this.model.organization){
      if (this.model.organization.constructor.name == "String") {
        this.api.addOrganization({name: this.model.organization}).subscribe( org => {
          this.model.organization_id = org.id;
          this.model.organization = org;
          this.updatedModel = this.model;
          callback();
        })
      } else {
        this.model.organization_id = this.model.organization.id;
        this.updatedModel = this.model;
        callback();
      }
    } else {
      this.updatedModel = this.model;
      callback();
    }
  }

  submit() {

    // Post to the study endpoint, and then close
    // if (this.form.valid) {
    //   if (this.createNew) {
    //     this.updateOrganization(() => this.addAndClose());
    //   } else {
    //     // this.updateStudyCategories();
    //     this.updateRelatedModel('category', 'categories');
    //     this.updateRelatedModel('investigator', 'investigators');
    //     this.updateOrganization(() => this.updateAndClose());
    //   }
    // }
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
