import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { moveIn, fallIn } from '../router.animations';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'signup',
  templateUrl: 'signup.component.html',
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class SignupComponent {

  state: string = '';
  error: any;
  dataLoading: boolean = false;
  brokenNetwork = false;
  savedChanges = false;

  constructor(private _backendService: FirebaseService, private router: Router) {
  }

  routeLoginPage (){
    this.router.navigate(['/login']);
  }

  onSubmit(formData) {
    this.dataLoading = true;
    this._backendService.createUser(formData).then(
      (success) =>
      {
        this.dataLoading = false;
        this.savedChanges = true;
      },
        (error) => {
          this.error = error;
          this.dataLoading = false;
          this.savedChanges = false;
        }
      )
  }
}