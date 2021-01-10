```diff
- If you like this project, please consider giving it a star (*) and follow me at GitHub & YouTube.
```
[<img src="https://github.com/AmitXShukla/AmitXShukla.github.io/blob/master/assets/icons/youtube.svg" width=40 height=50>](https://youtube.com/AmitShukla_AI)
[<img src="https://github.com/AmitXShukla/AmitXShukla.github.io/blob/master/assets/icons/github.svg" width=40 height=50>](https://github.com/AmitXShukla)
[<img src="https://github.com/AmitXShukla/AmitXShukla.github.io/blob/master/assets/icons/medium.svg" width=40 height=50>](https://medium.com/@Amit_Shukla)
[<img src="https://github.com/AmitXShukla/AmitXShukla.github.io/blob/master/assets/icons/twitter_1.svg" width=40 height=50>](https://twitter.com/ashuklax)

<h2>Download Online Store eCommerce App in Angular 11 Firebase with complete source code</h2>
<br>
<b><i>This repository is updated to Angular v11.0.0 now.</i></b>
Please don't forget to update tsconfig.json as well.

<br>
<a href="https://www.youtube.com/playlist?list=PLp0TENYyY8lEjtN1YiJTCTFP7OpQ4Fmuo" target="_blank">Click here for Video Tutorial !</a>
<br>
In this video, I will show you one complete Online Store eCommerce App using all latest versions like Angular 6, Angularfire2 and Google Firebase/Firestore database, You will be able to download entire source code, deploy it on your local machine or cloud and I will leave it up to you if you want to enhance this and make more changes.<br/>
THis tutorial is not for beginners and is not for teaching purpose, but you don't need to be an expert either to understand these technologies.<br/>
I recommend to please take this video as a design pattern discussion where I am showing how we can use different technologies to solve real work problems and deliver a great quality app.<br/>

<b>Objective: </b> This document serves as an Installation Guide for Elish eStore Cloud free commmunity version Desktop/Mobile App.<br><br>
<b>Tools: </b> Angular 6, Google Firebase/Firestore<br/>

<h2><u>What's included :</u></h2>
In this repository, Only Online Shop portal is included.
<h2><u>Elish CRM Cloud v1.1.8</u></h2>
Elish CRM Cloud provide a completely free desktop and mobile app for managing Customer, Vendors, CRM and other management modules.<br><br>
<u><i>future update/version/releases after v1.1.8 baseline release, will include new features and bug fixes for free under community license. For enhancement/feature requests, please open a new issue at this Github Repository.</i></u><br><br>
<h2><u>App Choices:</u></h2>
#A. Elish HCM Cloud also provide a free web and mobile Enterprise app, hosted on Google Cloud with Google Firebase/Firestore database at:<br><br>
https://alivetracking.com<br>
Google Playstore - https://alivetracking.com<br><br>
#B. For Community/Developer edition, developers can download a copy of "out of the box installable software package" or complete source code for free.<br><br>

Below documentation serves as installation instruciton for point #B mentioned above.<br>
1. Installation Instruction for "out of the box Installable Desktop/Mobile App"<br>
2. Community/Developers Open Source Code guide<br>
<h2><u>Installation Instruction for "out of the box Installable Desktop/Mobile App"</u><h2>
------------------------------------------------------------------------------------

<u><i>If you wish to migrate/upgrade your old desktop or client/server software to enterprise desktop/mobile app, please write to info@elishconsulting.com for Enterprise version upgrade.</i></u><br><br>
<b>Step #1:</b> Install NodeJS, Angular CLI<br>
Please follow Video Tutorials along installation instruction and proceed to next step when database installation is complete and verified.<br><br>
<b>Step #2:</b> Signup with Google Firebase<br>
Please follow Video Tutorials along installation instruction and proceed to next step when database installation is complete and verified.<br><br>
1. Setup Firebase Sign-in methods (enable Google, Facebook and email signin)<br>
2. Make sure, Firebase Sign-in method include your domain for autherntication.<br>
3. Open Firebase > Database > rules <br>
copy paste following code in rules tab, save and publish.<br><br>
```ts
service cloud.firestore {
  match /databases/{database}/documents {
   
  	match /onlinestore/{document} {
    allow read: if false;
    allow write: if false;
    }
    
    match /onlinestore/elish/admins/{documents} {
    allow read: if true;
    allow write: if false;
    }
    
    match /onlinestore/elish/carts/{documents} {
    allow read: if request.auth.uid!= null && 
    request.auth.uid == get(/databases/$(database)/documents/onlinestore/elish/carts/$(document)).data.authid;
    allow write: if request.auth.uid!= null;
    }
    
    match /onlinestore/elish/product/{documents} {
    allow read: if true;
    allow write: if request.auth.uid!= null;
    }
  
  	// rules for estore collections
  	 match /estore/{document} {
      allow read: if request.auth.uid == get(/databases/$(database)/documents/estore/$(request.auth.uid)).data.authid;
      allow write: if false;
    }
    match /estore/{document}/product/{prods} {
      allow read: if true;
      allow write: if request.auth.uid == get(/databases/$(database)/documents/estore/$(request.auth.uid)).data.authid;
    }
    match /estore/{document}/cart/{shoppingcart} {
      allow read: if isSignedIn() && isDocOwner();
      allow write: if isSignedIn();
    }
    match /estore/{document}/interests/{shoppingcart} {
      allow read: if false;
      allow write: if isSignedIn();
    }
  
    // rules for PORTALDB collections
    match /portaldb/{portaldb} {
      allow read, write: if request.auth.uid != null;
    }
    // rules for USERAUTH collections
    match /userauth/{userauth} {
      allow read, write: if request.auth.uid != null;
    }
    // rules for USERDB collections
    match /userdb/{user} {
      allow read, write: if request.auth.uid != null;
    }
    
    // rules for PORTAL collections
    match /portal/{portaldb} {
      allow read, write: if request.auth.uid != null;
    }
  
  	// rules for USERS collection
  	match /users/{users} {
  	//allow read: if isDocOwner();
    //allow create: if isSignedIn();
    //allow write: if isDocOwner() && get(/databases/$(database)/documents/portal/$(request.resource.data.portal)).data.portal == request.resource.data.portal && get(/databases/$(database)/documents/portal/$(request.resource.data.portal)).data.key == request.resource.data.key;
    allow read, write: if request.auth.uid != null;
    }
      
    }
  	
   // helper functions
    function isDocOwner(){
    // assuming document has a field author which is uid
    // Only the authenticated user who authored the document can read or write
    	return request.auth.uid == resource.data.author;
      // This above read query will fail
    // The query fails even if the current user actually is the author of every story document.
    //  The reason for this behavior is that when Cloud Firestore applies your security rules, 
    //  it evaluates the query against its potential result set,
    //   not against the actual properties of documents in your database. 
    //   If a query could potentially include documents that violate your security rules, 
    //   the query will fail.
    //   on your client app, make sure to include following
    //   .where("author", "==", this.afAuth.auth.currentUser.uid)
    }
    function isSignedIn() {
    // check if user is signed in
          return request.auth.uid != null;
    }
    function isAdmin() {
    return get(/databases/$(database)/documents/attendanceusers/
    $(request.auth.uid)).data.isAdmin == true;
    }
    
    // examples from firestore
    function signedInOrPublic() {
    // True if the user is signed in or the requested data is 'public'
    // assuming document has a field name 'visibility'
      return request.auth.uid != null || resource.data.visibility == 'public';
    }
    function getRole(rsc) {
        // Read from the "roles" map in the resource (rsc).
          return rsc.data.roles[request.auth.uid];
		}
    function isOneOfRoles(rsc, array) {
          // Determine if the user is one of an array of roles
          return isSignedIn() && (getRole(rsc) in array);
    }
    function onlyContentChanged() {
          // Ensure that user is not updating their own roles
          // fields are added to the document.
            return request.resource.data.roles == '';
    }
    function isModuleAdmin() {
    return get(/databases/$(database)/documents/payrollusers/$(request.auth.uid)).data.roles["admin"] == true;
    }
}
```
