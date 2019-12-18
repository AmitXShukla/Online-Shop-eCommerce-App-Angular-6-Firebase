<h2>Download Online Store eCommerce App in Angular 9 + Firebase with complete source code</h2>
<br>
<b><i>This repository is updated to Angular v9.0.0 now.</i></b>
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
service cloud.firestore {<br>
  match /databases/{database}/documents {<br>
  	// rules for estore collections<br>
  	 match /estore/{document} {<br>
      allow read: if request.auth.uid == get(/databases/$(database)/documents/estore/$(request.auth.uid)).data.authid;<br>
      allow write: if false;<br>
    }<br>
    match /estore/{document}/product/{prods} {<br>
      allow read: if true;<br>
      allow write: if request.auth.uid == get(/databases/$(database)/documents/estore/$(request.auth.uid)).data.authid;<br>
    }<br>
    match /estore/{document}/cart/{shoppingcart} {<br>
      allow read: if isSignedIn() && isDocOwner();<br>
      allow write: if isSignedIn();<br>
    }<br>
    match /estore/{document}/interests/{shoppingcart} {<br>
      allow read: if false;<br>
      allow write: if isSignedIn();<br>
    }
  }<br>
}<br>
