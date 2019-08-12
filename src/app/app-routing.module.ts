import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutusComponent }   from './aboutus/aboutus.component';
import { LoginComponent } from './shared/login/login.component';
import { SignupComponent } from './shared/login/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin/admin.login.component';
import { SetProductComponent } from './admin/setproduct.component';
import { ShoppingComponent } from './shop/shopping.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthGuardAdmin } from './services/auth-guard.admin.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
  { path: 'admin', component: AdminLoginComponent, canActivate: [AuthGuardService] },
  { path: 'adminmanage', component: AdminComponent, canActivate: [AuthGuardService, AuthGuardAdmin] },
  { path: 'set-product', component: SetProductComponent, canActivate: [AuthGuardService, AuthGuardAdmin] },
  { path: 'shopping', component: ShoppingComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}