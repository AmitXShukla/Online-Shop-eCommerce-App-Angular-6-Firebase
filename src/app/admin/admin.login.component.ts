import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-login',
  templateUrl: 'admin.login.component.html'
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  @Input() imageUrl: string;
  @Input() pageTitle: string;
  @Input() helpType: string;
  //myDocData: Observable<any>;
  myDocData: any;
  isAdmin: boolean = false;

  savedChanges = false;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;
  private querySubscription;

  constructor(private _backendService: FirebaseService, private _router: Router) {
  }

  ngOnInit(){
  }
  loginAdmin(){
    //this.myDocData = this._backendService.getAdminPortal();
      this.querySubscription = this._backendService.getAdminPortal().subscribe((res) =>
    {
          if (res) {
            this.myDocData = res;
            this.dataLoading=false;
            this.isAdmin = true;
            return res;
          } else {
            this.error = true;
            this.errorMessage = "You are not authorized Admin";
          }
        },
        (error) => {
          this.error = true;
          this.errorMessage = "You are not authorized Admin";
          this.dataLoading=false;
        },
        () => {this.dataLoading=false;}
    );
  }
  
  logout() {
    this._backendService.logout()
     .then(
       (success) => {
       this._router.navigate(['/login']);
     }).catch(function (error) {
         console.log(error);
       })
    }

  setPreferences(center, token){
    window.localStorage.setItem("center",center);
    window.localStorage.setItem("token",token);
    this._router.navigate(['/adminmanage'])
  }

  ngOnDestroy(){
    // this is not needed when observable is used, in this case, we are registering user on subscription
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
  }
  }
}