import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminHomeComponent} from '../admin-home/admin-home.component';
import {AboutComponent} from '../about/about.component';
import {FlowCompleteComponent} from '../flow-complete/flow-complete.component';
import {FlowComponent} from '../flow/flow.component';
import {ForgotPasswordComponent} from '../forgot-password/forgot-password.component';
import {HomeComponent} from '../home/home.component';
import {LoginComponent} from '../login/login.component';
import {LogoutComponent} from '../logout/logout.component';
import {PasswordResetComponent} from '../password-reset/password-reset.component';
import {ProfileComponent} from '../profile/profile.component';
import {RegisterComponent} from '../register/register.component';
import {ResourceDetailComponent} from '../resource-detail/resource-detail.component';
import {ResourceFormComponent} from '../resource-form/resource-form.component';
import {SearchComponent} from '../search/search.component';
import {StudiesComponent} from '../studies/studies.component';
import {StudyDetailComponent} from '../study-detail/study-detail.component';
import {StudyFormComponent} from '../study-form/study-form.component';
import {TermsComponent} from '../terms/terms.component';
import {UserAdminDetailsComponent} from '../user-admin-details/user-admin-details.component';
import {TimedoutComponent} from '../timed-out/timed-out.component';
import {RoleGuard} from './role-guard';
import {AuthGuard} from './auth-guard';
import {MirrorComponent} from '../mirror/mirror.component';
import {NotMirroredGuard} from './not-mirrored-guard';
import {UvaEducationComponent} from '../uva-education/uva-education.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [NotMirroredGuard]},
  {path: 'home', component: HomeComponent, data: {title: 'Welcome Autism DRIVE'}, canActivate: [NotMirroredGuard]},
  {path: 'uva-education', component: UvaEducationComponent, data: {title: 'UVA Education'}, canActivate: [NotMirroredGuard]},
  {
    path: 'about',
    component: AboutComponent,
    data: {title: 'Enroll in an Autism DRIVE Study'},
    canActivate: [NotMirroredGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {title: 'Log in to Autism DRIVE', hideHeader: true}
  },
  {path: 'login', component: LoginComponent, data: {title: 'Log in to Autism DRIVE', hideHeader: true}},
  {
    path: 'reset_password/:role/:email_token', component: PasswordResetComponent,
    data: {title: 'Reset your Autism DRIVE password', hideHeader: true}
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {title: 'Your Autism DRIVE Account'},
    canActivate: [AuthGuard, NotMirroredGuard]
  },
  {
    path: 'flow/complete',
    component: FlowCompleteComponent,
    data: {title: 'Enrollment complete'},
    canActivate: [AuthGuard, NotMirroredGuard]
  },
  {
    path: 'flow/:flowName/:participantId',
    component: FlowComponent,
    data: {title: 'Your Autism DRIVE Account'},
    canActivate: [AuthGuard, NotMirroredGuard]
  },
  {path: 'register', component: RegisterComponent, data: {title: 'Create an Autism DRIVE Account', hideHeader: true}},
  {path: 'event/:resourceId', component: ResourceDetailComponent, data: {title: 'Event Details'}},
  {path: 'location/:resourceId', component: ResourceDetailComponent, data: {title: 'Location Details'}},
  {path: 'resource/:resourceId', component: ResourceDetailComponent, data: {title: 'Resource Details'}},
  {
    path: ':resourceType/:resourceId/edit',
    component: ResourceFormComponent,
    data: {title: 'Edit Resource', roles: ['admin', 'editor']},
    canActivate: [RoleGuard]
  },
  {
    path: 'resources/add',
    component: ResourceFormComponent,
    data: {title: 'Add Resource', roles: ['admin', 'editor']},
    canActivate: [RoleGuard]
  },
  {path: 'studies', component: StudiesComponent, data: {title: 'Autism DRIVE Studies'}},
  {
    path: 'studies/add',
    component: StudyFormComponent,
    data: {title: 'Create an Autism DRIVE Study', roles: ['admin',]},
    canActivate: [RoleGuard]
  },
  {path: 'study/:studyId', component: StudyDetailComponent, data: {title: 'Study Details'}},
  {
    path: 'study/edit/:studyId',
    component: StudyFormComponent,
    data: {title: 'Edit Study', roles: ['admin',]},
    canActivate: [RoleGuard]
  },
  {
    path: 'terms/:relationship',
    component: TermsComponent,
    data: {title: 'Agree to Terms and Conditions for an Autism DRIVE Account', hideHeader: true}
  },
  {path: 'logout', component: LogoutComponent, data: {title: 'You have been logged out.', hideHeader: true}},
  {path: 'timedout', component: TimedoutComponent, data: {title: 'Your session has timed out.', hideHeader: true}},
  {path: 'search', component: SearchComponent, data: {title: 'Search'}},
  {path: 'search/:query', component: SearchComponent, data: {title: 'Search Resources'}},
  {
    path: 'admin',
    component: AdminHomeComponent,
    data: {title: 'Admin Home', roles: ['admin',]},
    canActivate: [RoleGuard]
  },
  {
    path: 'admin/user/:userId',
    component: UserAdminDetailsComponent,
    data: {title: 'User Admin Details', roles: ['admin', 'researcher']},
    canActivate: [RoleGuard],
  },
  {path: 'mirrored', component: MirrorComponent, data: {title: 'Mirrored Server Details'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class RoutingModule {
}
