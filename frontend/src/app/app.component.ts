import { Component } from '@angular/core';
import { ActivatedRoute, ActivationEnd, ActivationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'star-drive';
  hideHeader = false;

  public constructor (
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.router.events.subscribe((e) => {
      if (e instanceof ActivationStart || e instanceof ActivationEnd) {
        if (e.snapshot && e.snapshot.data) {
          const data = e.snapshot.data;
          this.hideHeader = !!data.hideHeader;
        }
      }
    });
  }
}
