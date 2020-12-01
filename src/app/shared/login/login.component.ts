import { Component, OnInit,AfterViewInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firestore from 'firebase/app';
import { environment } from '../../../environments/environment';
import { FirebaseService } from '../../services/firebase.service';
import { Observable } from "rxjs/Rx";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit, AfterViewInit  {
  socialAuth: boolean = false; // show Google and FB Sign in only when social auth is enabled
  error: any;
  dataLoading: boolean = false;
  brokenNetwork = false;
  isLoggedIn;

  constructor(public afAuth: AngularFireAuth, private _router: Router, private _backendService: FirebaseService) { }

  ngOnInit() {
      this.socialAuth = environment.socialAuthEnabled; // show Google and FB Sign in only when social auth is enabled
  }

  ngAfterViewInit(){
      if(this.afAuth.authState) {
        this.getAuthStatus();
      }
  }

  getAuthStatus(){
    this._backendService.redirectLogin().then((result) => {
      if (result.credential) {
        window.localStorage.setItem("displayName",result.user.displayName);
        window.localStorage.setItem("email",result.user.email);
        window.localStorage.setItem("picture",result.user.photoURL);
        this.isLoggedIn = "try this";
      }
    }).catch(
      (err) => {
        this.error = err;
      })
  }

  login(loginType, formData?) {
      this._backendService.login(loginType, formData);
      /**
      .then(
        (success) => {
          if(formData) {
            window.localStorage.setItem("email",formData.email);
          }
          //console.log(success);
          this._router.navigate(['/settings']);
        }).catch(
        (err) => {
          this.error = err;
        })
      ;
       */
    }
  }
