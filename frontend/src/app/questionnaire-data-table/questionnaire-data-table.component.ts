import { Component, Input, OnChanges } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import { QuestionnaireDataSource } from '../_models/questionnaire_data_source';
import { snakeToUpperCase } from '../../util/snakeToUpper';

@Component({
  selector: 'app-questionnaire-data-table',
  templateUrl: './questionnaire-data-table.component.html',
  styleUrls: ['./questionnaire-data-table.component.scss']
})
export class QuestionnaireDataTableComponent implements OnChanges {
  @Input()
  questionnaire_name: string;

  dataSource: QuestionnaireDataSource;
  displayedColumns = [];
  columnNames = [];


  constructor(
    private api: ApiService,
  ) {}

  ngOnChanges() {
    this.dataSource = new QuestionnaireDataSource(this.api);
    this.dataSource.loadQuestionnaires(this.questionnaire_name);
    this.load_columns();
  }

  load_columns() {
    this.displayedColumns = [];
    this.columnNames = [];
    this.api.getQuestionnaireListMeta(this.questionnaire_name).subscribe(
      result => {
        for (let fieldIndex in result['fields']) {
          let column = result['fields'][fieldIndex];
          if (!this.displayedColumns.includes(column.name)){
            this.displayedColumns.push({'name': column.name, 'type': column.type});
          }
          if (!this.columnNames.includes(column.name)){
            this.columnNames.push(column.name);
          }
        }
      }
    );
  }

  format_element(element, column) {
    if (column.type == 'DATETIME') {
      let date = new Date(element[column.name]);
      return date.toUTCString();
    } else {
      return element[column.name];
    }
  }

  exportQ(questionnaire_name) {
    console.log('clicking the button for export all');
    this.api.exportQuestionnaire( questionnaire_name).subscribe( response => {
      console.log('data', response);
      const filename = response.headers.get('x-filename');
      const blob = new Blob([response.body], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

      const url = URL.createObjectURL(blob);
      const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

      a.href = url;
      a.download = filename;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  get snakeToUpperCase(){ return snakeToUpperCase }
}
