import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ActivationEnd, ActivationStart, NavigationEnd, Router} from '@angular/router';
import { User } from './_models/user';
import { AuthenticationService } from './_services/api/authentication-service';
import {ApiService} from './_services/api/api.service';
import {GoogleAnalyticsService} from './google-analytics.service';
import {ConfigService} from './_services/config.service';
import {Meta} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'star-drive';
  hideHeader = false;
  currentUser: User;

  public constructor(
    private authenticationService: AuthenticationService,
    private api: ApiService,
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService,
    private configService: ConfigService,
    private meta: Meta,
    private route: ActivatedRoute,

  ) {
    this.googleAnalyticsService.init();
    this.router.events.subscribe((e) => {
      if (e instanceof ActivationStart || e instanceof ActivationEnd) {
        if (e.snapshot && e.snapshot.data) {
          const data = e.snapshot.data;
          this.hideHeader = !!data.hideHeader;
        }
      }
    });
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.meta.addTags([
      { property: 'og:url', content: location.origin },
      { property: 'og:image', content: location.origin + '/assets/home/hero-family.jpg' },
      { property: 'og:image:secure_url', content: location.origin + '/assets/home/hero-family.jpg' },
      { name: 'twitter:image', content: location.origin + '/assets/home/hero-family.jpg' },
    ]);
  }

  ngOnInit() {
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const title = this.route.snapshot.firstChild.data.title;
        if (title) {
          this.meta.updateTag({ property: 'og:title', content: title }, `property='og:title'`);
          this.meta.updateTag({ name: 'twitter:text:title', content: title }, `name='twitter:text:title'`);
        }
        this.meta.updateTag({ property: 'og:url', content: location.href }, `property='og:url'`);
      }
    });
  }

}
