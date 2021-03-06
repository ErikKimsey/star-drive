import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { MediaMatcher } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  throttleTime
} from 'rxjs/operators';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/api/authentication-service';
import { ApiService } from '../_services/api/api.service';
import {ConfigService} from '../_services/config.service';

export enum ViewportWidth {
  Small = 'sm',
  Medium = 'md',
  Large = 'lg'
}

export enum VisibilityState {
  Visible = 'visible',
  Hidden = 'hidden'
}

export enum Direction {
  Up = 'Up',
  Down = 'Down'
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('toggleMobileMenu', [
      state(VisibilityState.Hidden, style({ top: '-100vh' })),
      state(VisibilityState.Visible, style({ top: '148px' })),
      transition('* => *', animate('500ms ease-in'))
    ]),
    trigger('toggleHide', [
      state(VisibilityState.Hidden + '-' + ViewportWidth.Small, style({ transform: 'translateY(-200%)' })),
      state(VisibilityState.Visible + '-' + ViewportWidth.Small, style({ transform: 'translateY(0)' })),
      state(VisibilityState.Hidden + '-' + ViewportWidth.Medium, style({ transform: 'translateY(-200%)' })),
      state(VisibilityState.Visible + '-' + ViewportWidth.Medium, style({ transform: 'translateY(0)' })),
      state(VisibilityState.Hidden + '-' + ViewportWidth.Large, style({ transform: 'translateY(-200%)' })),
      state(VisibilityState.Visible + '-' + ViewportWidth.Large, style({ transform: 'translateY(0)' })),
      transition('* => *', animate('500ms ease-in'))
    ]),
    trigger('toggleDock', [
      state(VisibilityState.Hidden + '-' + ViewportWidth.Small, style({ top: '52px' })),
      state(VisibilityState.Visible + '-' + ViewportWidth.Small, style({ top: '92px' })),
      state(VisibilityState.Hidden + '-' + ViewportWidth.Medium, style({ top: '84px' })),
      state(VisibilityState.Visible + '-' + ViewportWidth.Medium, style({ top: '124px' })),
      state(VisibilityState.Hidden + '-' + ViewportWidth.Large, style({ top: '52px' })),
      state(VisibilityState.Visible + '-' + ViewportWidth.Large, style({ top: '92px' })),
      transition('* => *', animate('500ms ease-in'))
    ]),
    trigger('toggleBackground', [
      state(VisibilityState.Hidden, style({ top: '-40px' })),
      state(VisibilityState.Visible, style({ top: '0px' })),
      transition('* => *', animate('500ms ease-in'))
    ])
  ]
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private headerVisible = true;
  @Input() currentUser: User;
  menuVisible = false;
  mobileQuery: MediaQueryList;
  mdMediaQuery: MediaQueryList;
  lgMediaQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  private _mdMediaQueryListener: () => void;
  private _lgMediaQueryListener: () => void;

  get viewportWidth(): string {
    if (this.mobileQuery.matches) { return ViewportWidth.Small; }
    if (this.mdMediaQuery.matches) { return ViewportWidth.Medium; }
    if (this.lgMediaQuery.matches) { return ViewportWidth.Large; }
  }

  get headerState(): string {
    const visibilityState = this.headerVisible ? VisibilityState.Visible : VisibilityState.Hidden;
    return visibilityState + '-' + this.viewportWidth;
  }

  get menuState(): string {
    return this.menuVisible ? VisibilityState.Visible : VisibilityState.Hidden;
  }

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private router: Router,
    private api: ApiService,
    public config: ConfigService,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 959px)');
    this.mdMediaQuery = media.matchMedia('(min-width: 960px) and (max-width: 1279px)');
    this.lgMediaQuery = media.matchMedia('(min-width: 1280px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this._mdMediaQueryListener = () => changeDetectorRef.detectChanges();
    this._lgMediaQueryListener = () => changeDetectorRef.detectChanges();

    // tslint:disable-next-line:deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);

    // tslint:disable-next-line:deprecation
    this.mdMediaQuery.addListener(this._mdMediaQueryListener);

    // tslint:disable-next-line:deprecation
    this.lgMediaQuery.addListener(this._lgMediaQueryListener);
  }

  // https://gist.github.com/zetsnotdead/08cc5632f3427d41254068d322807c51
  ngAfterViewInit() {
    this.watchScrollEvents();
  }

    ngOnDestroy(): void {
    // tslint:disable-next-line:deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);

    // tslint:disable-next-line:deprecation
    this.mdMediaQuery.removeListener(this._mdMediaQueryListener);

    // tslint:disable-next-line:deprecation
    this.lgMediaQuery.removeListener(this._lgMediaQueryListener);
  }

  goLogout($event: MouseEvent) {
    $event.preventDefault();
    this.authenticationService.logout();
    this.router.navigate(['logout']);
  }

  goLogin() {
    const onLoginScreen = /^\/login/.test(this.router.url);
    const onLogoutScreen = /^\/logout/.test(this.router.url);
    const onHomeScreen = /^\/home/.test(this.router.url);
    const onTimedOutScreen = /^\/timedout/.test(this.router.url);
    if (onHomeScreen || onLoginScreen || onLogoutScreen || onTimedOutScreen) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  watchScrollEvents() {
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(10),
      map(() => window.pageYOffset),
      pairwise(),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
      distinctUntilChanged(),
      share()
    );

    const scrollUp$ = scroll$.pipe(
      filter(direction => direction === Direction.Up)
    );

    const scrollDown$ = scroll$.pipe(
      filter(direction => direction === Direction.Down)
    );

    scrollUp$.subscribe(() => {
      this.headerVisible = true;
    });

    scrollDown$.subscribe(() => {
      this.headerVisible = false;
      this.menuVisible = false;
    });
  }
}
