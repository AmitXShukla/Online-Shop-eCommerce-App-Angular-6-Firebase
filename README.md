<h2><u>Online Store eCommerce App</u></h2>
<h4><u>Part -2</u></h4>
In this part, We will install all necessary development tools requied for this project.<br/>

<h4><u>Let's get started</u></h4>
Step 1: Install VSCode<br/><br/>
Step 2: Install NodeJS<br/>
https://nodejs.org/en/<br/><br/>

<span style="color:green">VSCODE > Terminal > node -v</span>  // show current node version installed<br>
<span style="color:green">npm -v</span> // show current npm version<br><br>
Step 3:<br>
$npm install -g @angular/cli<br><br>
<span style="color:green">ng -v</span> // show current Angular-Cli version<br>
<span style="color:green">ng new onlinestore</span> // create a new ng app<br>
<span style="color:green"> cd onlinestore</span><br>
<h4> Clean up tasks:</h4>
<span style="color:green">copy over favicon.ico in assets/icon directory</span><br>
<span style="color:green">update index.html to reflect new favicon.ico changes</span><br>
<span style="color:green">update polyfill.json</span><br> - In case of using web animations or if you are planning to support older browser versions.<br>
<span style="color:green">and in case of adding a polyfill, please make sure to npm install related package for chosen polyfill.</span><br>
<span style="color:green"><h4>update gitignore file</h4></span>
- Please include files/folder which you do not wish to include to Git Repository like < dist > or < node_modules > folder
OR environment.ts, environment.prod.ts etc

<h4>update Angular-cli.json settings </h4>
<span style="color:green">"prefix": "app" </span><br>
get rid of "app" prefix, otherwise, this setting will prefix, all selector with this string, like FooterComponent will have selector = app-footer
<br>
<h4> Step 2: Install Angular Materials</h4>
<span style="color:green">npm install --save @angular/material @angular/cdk @angular/animations hammerjs</span><br>

<h4> Step 3. Include a theme</h4>
add this to styles.css or copy this over to assets/css directory<br>

<span style="color:green">@import "~@angular/material/prebuilt-themes/indigo-pink.css";</span><br>
<span style="color:green"> ng serve</span><br>

<h4> Step 4. Google Material Icons</h4>
< link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" >

_________________________

<h4>create custom material module</h4>
<span style="color:green">ng g module shared/custommaterial</span><br>

<h4>update app.module.ts</h4> to include ElishCustomMaterialModule in IMPORT section <br>
<span style="color:green">(add to IMPORT section)</span>

<h4>Now You have all Angular Material dependencies installed.</h4>

ng g module app-routing --flat --module=app<br>
ng g c shared/aboutus<br>
ng g c shared/header<br>
ng g c shared/footer<br><br>

Make sure all these components are included in routes and routes are accessible.<br>