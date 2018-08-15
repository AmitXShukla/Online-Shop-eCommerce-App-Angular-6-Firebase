import { CanActivate, Router } from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class AuthGuardAdmin implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if(localStorage.getItem('token') == "7PjNil") {
       return true;
    } else {
       this.router.navigate(['/login']);
       return false;
   }
}
}