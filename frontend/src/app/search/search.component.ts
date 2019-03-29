import { FormControl, FormGroup } from '@angular/forms';
import { MatInput, MatPaginator, MatSidenav } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import {Component, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Filter, Hit, Query} from '../_models/query';
import {ApiService} from '../_services/api/api.service';
import { SearchService } from '../_services/api/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() query: Query;

  showFilters = false;
  searchForm: FormGroup;
  searchBox: FormControl;
  loading = true;
  hideResults = true;
  filters: Filter[];
  pageSize = 20;

  @ViewChild('sidenav') public sideNav: MatSidenav;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput', { read: MatInput }) public searchInput: MatInput;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private searchService: SearchService
  ) {

    this.route.queryParamMap.subscribe(qParams => {
      let words = '';
      const filters: Filter[] = [];

      for (const key of qParams.keys) {
        if (key === 'words') {
          words = qParams.get(key);
        } else {
          filters.push({ field: key, value: qParams.get(key) });
        }
      }

      this.query = new Query({
        query: words,
        filters: filters,
        size: this.pageSize,
      });
    });

    this.renderer.listen(window, 'resize', (event) => {
      this.checkWindowWidth();
    });
  }

  ngOnInit() {
    this.doSearch();
    this.searchBox = new FormControl();
    this.searchForm = new FormGroup({
      searchBox: this.searchBox
    });

    this.searchBox.setValue(this.query.words);
    this.searchBox.valueChanges.pipe(
      debounceTime(300)).subscribe(query => {
        this.updateQuery(query);
      });

    this.searchInput.focus();
  }

  private checkWindowWidth(): void {
    if (window.innerWidth > 768) {
      this.sideNav.mode = 'side';
      this.sideNav.opened = false;
    } else {
      this.sideNav.mode = 'over';
      this.sideNav.opened = false;
    }
  }

  updateQuery(words: string) {
    this.hideResults = false;
    this.query.words = words;
    this.query.start = 0;
    this.paginator.firstPage();
    this.doSearch();
  }

  updateUrl(query: Query) {
    const queryArray: string[] = [];

    if (query.hasOwnProperty('query') && query.words) {
      queryArray.push(`query=${query.words}`);
    }

    for (const filter of query.filters) {
      queryArray.push(`${filter.field}=${filter.value}`);
    }

    const url = queryArray.length > 0 ? `/search/filter?${queryArray.join('&')}` : '/search';
    this.router.navigateByUrl(url);

  }

  doSearch() {
    this.loading = true;

    this.hideResults = (
      (this.query.words === '') &&
      (this.query.filters.length === 0)
    );

    this.updateUrl(this.query);

    this.searchService.search(this.query).subscribe(
      (query) => {
        this.loading = false;
        this.query = query;
        this.checkWindowWidth();
      }
    );
    if ((<any>window).gtag) {
      (<any>window).gtag('event', this.query.words, {
        'event_category': 'search'
      });
    }
  }

  sortByDate() {
    this.query.sort = '-last_updated';
    this.showFilters = false;
    this.query.start = 0;
    this.doSearch();
  }

  sortByRelevance() {
    this.query.sort = '_score';
    this.showFilters = false;
    this.query.start = 0;
    this.doSearch();
  }

  addFilter(field: string, value: string) {
    this.query.filters.push({ field: field, value: value });
    this.showFilters = false;
    this.query.start = 0;
    this.paginator.firstPage();
    this.doSearch();
  }

  removeFilter(filter: Filter) {
    const index = this.query.filters.indexOf(filter, 0);
    if (index > -1) {
      this.query.filters.splice(index, 1);
    }
    this.showFilters = false;
    this.query.start = 0;
    this.doSearch();
  }

  updatePage() {
    this.query.size = this.paginator.pageSize;
    this.query.start = (this.paginator.pageIndex * this.paginator.pageSize) + 1;
    this.doSearch();
  }

}
