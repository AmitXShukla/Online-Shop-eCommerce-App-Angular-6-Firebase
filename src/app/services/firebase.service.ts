import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
//import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { environment } from '../../environments/environment';
// import { auth } from 'firebase/app';
import auth from 'firebase';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
// import { firestore } from 'firebase/app';
import firestore from 'firebase';

// import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    private _defaultCenterColl: string = "elish";
    private _userColl: string = "userdb";
    private _eStoreColl: string = "estore";
    authState: any = null;
    
    constructor(private _http: HttpClient, public afAuth: AngularFireAuth, private afs: AngularFirestore) { 
        this.afAuth.authState.subscribe( authState => {
            this.authState = authState;
          });
    }

    getConfig() {
        return environment.social;
    }

    checkIfUserSignedIn() {
        return this.afAuth.authState;
    }

    // function to send emails using a PHP API
    sendEmail(messageData) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/X-www-form-urlencoded' })
        };
        return this._http.post(environment.emailAPI, messageData, httpOptions);
    }

    // sign-up page - create a new user
    createUser(formData) {
        if (environment.database == 'firebase') {
            return this.afAuth.createUserWithEmailAndPassword(formData.value.email, formData.value.password);
        }
        if (environment.database == 'SQL') {
            // need to call SQL API here if a SQL Database is used
        }
    }

    // login page - login with FB/GOOGLE/EMAIL, if formData is passed, this means is user is using email/password login
    login(loginType, formData?) {
        if (formData) {
            return this.afAuth.signInWithEmailAndPassword(formData.email, formData.password);
        } else {
            let loginMethod;
            if (loginType == 'FB') { loginMethod = new auth.auth.FacebookAuthProvider(); }
            if (loginType == 'GOOGLE') { loginMethod = new auth.auth.GoogleAuthProvider() }

            return this.afAuth.signInWithRedirect(loginMethod)
        }
    }

    logout() {
        window.localStorage.removeItem("displayName");
        window.localStorage.removeItem("email");
        window.localStorage.removeItem("picture");
        window.localStorage.removeItem("center");
        window.localStorage.removeItem("token");
        return this.afAuth.signOut();
    }

    // method to retreive firebase auth after login redirect
    redirectLogin() {
        return this.afAuth.getRedirectResult();
    }

    //////////// firebase eStore funcitons START ///////////////
    get timestamp() {
        var d = new Date();
        return d;
        //return firebase.firestore.FieldValue.serverTimestamp();
    }
    timestampMinusDays(filter) {
        var d = new Date();
        d.setDate(d.getDate() - filter);
        return d;
    }
    getCollectionURL(coll){
        let localCenter = localStorage.getItem('center') ? localStorage.getItem('center') : this._defaultCenterColl;
        return this._eStoreColl + "/" + localCenter + "/" + coll;
    /**
        let _collURL = "";
        if (filter == "customer") { _collURL = this._custColl; }
        if (filter == "lead") { _collURL = this._leadColl; }
        return _collURL;
         */
    }

    setExistingDoc(coll: string, docId: string, data: any) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.set(({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp,
            delete_flag: "N"
        }), { merge: true });
    }

    getAdminPortal(coll?: string){
        if (!coll || coll == "store") { coll = this._eStoreColl; }
        let x;
        return this.getDoc(coll,this.authState.uid);
    }
    // set product functions start
    getProduct(coll: string, docId: string) {
        coll = this._eStoreColl + "/" + localStorage.getItem('center') + "/" + coll;
        return this.getDoc(coll, docId);
    }
    setProduct(coll: string, formData: any, docId?: string) {
        coll = this._eStoreColl + "/" + localStorage.getItem('center') + "/" + coll;
        return this.setNewDoc(coll, formData);
    }
    setProductPic(filePath, coll, docId?){
        coll = this._eStoreColl + "/" + localStorage.getItem('center') + "/" + coll;
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.set({
            path: filePath
        },{merge: true});
    }
    deleteProductPic(coll, docId?){
        coll = this._eStoreColl + "/" + localStorage.getItem('center') + "/" + coll;
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.set({
            path: null
        },{merge: true});
    }
    getProducts(coll: string) {
        return this.afs.collection(this.getCollectionURL(coll), ref =>
            ref.where('delete_flag', '==', 'N')
                .orderBy('name', 'desc')
        ).valueChanges();
        // return this.afs.collection(this.getCollectionURL(coll), ref =>
        //     ref.where('delete_flag', '==', 'N')
        //         .orderBy('name', 'desc')
        // )
        //     .snapshotChanges().map(actions => {
        //         return actions.map(a => {
        //             const data = a.payload.doc.data();
        //             const id = a.payload.doc.id;
        //             return { id, ...data };
        //         });
        //     });
    }
    getFilterProducts(coll: string, filters) {
        return this.afs.collection(this.getCollectionURL(coll), ref =>
        ref.where('delete_flag', '==', 'N')
            .where('tags' , 'array-contains', filters)
            .orderBy('tags', 'desc')
    ).valueChanges();
        // .snapshotChanges()
        // .map(actions => {
        //     return actions.map(a => {
        //         const data = a.payload.doc.data();
        //         const id = a.payload.doc.id;
        //         return { id, ...data };
        //     });
        // });
    }
    deleteProduct(coll,docId){
        return this.deleteDoc(this.getCollectionURL(coll),docId);
    }
    updateProduct(coll,formData){
        return this.updateDoc(this.getCollectionURL(coll),formData._id,formData);
    }
    updateShoppingCart(coll: string, data){
        const id = this.afs.createId();
        const item = { id, name };
        const timestamp = this.timestamp
        var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(item.id);
        return docRef.set({
            ...data,
            //author: this.afAuth.currentUser.uid,
            author: this.authState.uid,
            // authorName: this.afAuth.currentUser.displayName,
            // authorEmail: this.afAuth.currentUser.email,
            // authorPhoto: this.afAuth.currentUser.photoURL,
            // authorPhone: this.afAuth.currentUser.phoneNumber,
            authorName: this.authState.displayName,
            authorEmail: this.authState.email,
            authorPhoto: this.authState.photoURL,
            authorPhone: this.authState.phoneNumber,
            updatedAt: timestamp,
            createdAt: timestamp,
            delete_flag: "N",
        });
    }
    updateShoppingInterest(coll: string, data){
        const id = this.afs.createId();
        const item = { id, name };
        const timestamp = this.timestamp
        var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(item.id);
        return docRef.set({
            ...data,
            author: this.authState.uid,
            authorName: this.authState.displayName,
            authorEmail: this.authState.email,
            authorPhoto: this.authState.photoURL,
            authorPhone: this.authState.phoneNumber,
            updatedAt: timestamp,
            createdAt: timestamp,
            delete_flag: "N",
        });
    }
    getCart(coll: string) {
        return this.afs.collection(this.getCollectionURL(coll), ref =>
            ref.where('delete_flag', '==', 'N')
                .where('author', '==', this.authState.uid)
                .orderBy('name', 'desc')
        ).valueChanges();
            // .snapshotChanges().map(actions => {
            //     return actions.map(a => {
            //         const data = a.payload.doc.data();
            //         const id = a.payload.doc.id;
            //         return { id, ...data };
            //     });
            // });
    }
    // helper functions
    getDoc(coll: string, docId: string) {
        return this.afs.collection(coll).doc(docId).valueChanges();
    }
    setNewDoc(coll: string, data: any, docId?: any) {
        const id = this.afs.createId();
        const item = { id, name };
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(item.id);
        return docRef.set({
            ...data,
            _id: id,
            updatedAt: timestamp,
            createdAt: timestamp,
            delete_flag: "N",
            username: this.authState.displayName,
            useremail: this.authState.email
        });
    }
    updateDoc(coll: string, docId: string, data: any) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.update({
            ...data,
            updatedAt: timestamp,
            delete_flag: "N",
            username: this.authState.displayName,
            useremail: this.authState.email
        });
    }
    deleteDoc(coll: string, docId: string) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.update({
            updatedAt: timestamp,
            delete_flag: "Y",
            username: this.authState.displayName,
            useremail: this.authState.email
        });
    }
    getDocs(coll: string, filters?: any) {
            if (filters) {
                if (filters.name > "") {
                    return this.afs.collection(coll, ref =>
                        ref.where('name', '>=', filters.name)
                            .where('delete_flag', '==', 'N')
                            .orderBy('name', 'desc')
                    ).valueChanges();
                        // .snapshotChanges().map(actions => {
                        //     return actions.map(a => {
                        //         const data = a.payload.doc.data();
                        //         const id = a.payload.doc.id;
                        //         return { id, ...data };
                        //     });
                        // });
                }
                if (filters.category > "") {
                    return this.afs.collection(coll, ref =>
                        ref.where('category', '>=', filters.category)
                            .where('delete_flag', '==', 'N')
                            .orderBy('category', 'desc')
                    ).valueChanges();
                        // .snapshotChanges().map(actions => {
                        //     return actions.map(a => {
                        //         const data = a.payload.doc.data();
                        //         const id = a.payload.doc.id;
                        //         return { id, ...data };
                        //     });
                        // });
                } else {
                    let fromDt = new Date(filters.fromdt);
                    let toDt = new Date(filters.todt);
                    return this.afs.collection(coll, ref =>
                        ref.where('updatedAt', '>=', fromDt)
                            .where('updatedAt', '<', toDt)
                            .where('delete_flag', '==', 'N')
                            .orderBy('updatedAt', 'desc')
                    ).valueChanges();
                        // .snapshotChanges().map(actions => {
                        //     return actions.map(a => {
                        //         const data = a.payload.doc.data();
                        //         const id = a.payload.doc.id;
                        //         return { id, ...data };
                        //     });
                        // });
                }
            } else {
                return this.afs.collection(coll, ref =>
                    ref.where('delete_flag', '==', 'N')
                        .orderBy('name')
                        .orderBy('updatedAt', "desc"))
                        .valueChanges();
                    // .snapshotChanges().map(actions => {
                    //     return actions.map(a => {
                    //         const data = a.payload.doc.data();
                    //         const id = a.payload.doc.id;
                    //         return { id, ...data };
                    //     });
                    // });
            }
    }

    //////////// firebase eStore funcitons END ///////////////

    // firebase SAMPLE functions below
    getMemberType() {
        this.member.counter = 25;
        this.member.usertype = 'regular';
        this.member.company = localStorage.getItem('eCRMkeyC');
        this.member.name = localStorage.getItem('eCRMkeyN');
        this.member.email = localStorage.getItem('eCRMkeyE');
        if (localStorage.getItem('eCRMkeyA') == '7PjNil') { this.member.usertype = 'regular'; }
        if (localStorage.getItem('eCRMkeyA') == '7PjAil') { this.member.usertype = 'admin'; }
        if (localStorage.getItem('eCRMkeyA') == '7PjPil') { this.member.usertype = 'pro'; }
        if (localStorage.getItem('eCRMkeyA') == '7PjNil') { this.member.counter = 25; }
        if (localStorage.getItem('eCRMkeyA') == '7PjAil') { this.member.counter = 500; }
        if (localStorage.getItem('eCRMkeyA') == '7PjPil') { this.member.counter = 50000000; }
        return this.member;
    }
    serverCol: AngularFirestoreCollection<any>;
    serverDoc: AngularFirestoreDocument<any>;

    private _newsUrl = "https://newsapi.org/v1/articles?source=the-hindu&sortBy=top&apiKey=1fbee980d10644bca6e4c3243034c10a";
    private _timeNewsUrl = "https://newsapi.org/v2/top-headlines?sources=google-news-in&apiKey=1fbee980d10644bca6e4c3243034c10a";
    private _finNewsUrl = "https://newsapi.org/v2/top-headlines?sources=financial-times&apiKey=1fbee980d10644bca6e4c3243034c10a";
    private _wikiUrl = 'http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK';
    private _userAuthColl: string = "userauth";
    private _portalColl: string = "portaldb";
    private _locColl: string = "location";
    private _custColl: string = "customer";
    private _leadColl: string = "lead";
    private _callsColl: string = "calls";
    private _salesColl: string = "sales";
    private _workColl: string = "workorder";
    private _emailsColl: string = "email";
    private _enquiryColl: string = "enquiry";
    private _visitsColl: string = "visit";
    private _visitorColl: string = "visitor";
    private _guestColl: string = "guest";
    private _hostColl: string = "host";
    private _attdColl: string = "attendance";
    private _vhColl: string = "visitregister";

    dbRef: any;
    geoFire: any;
    public lat;
    public lng;
    data;
    private userAuthData = new BehaviorSubject(undefined);
    public userPreferences = this.userAuthData.asObservable();
    public member = {
        company: '',
        counter: 25,
        usertype: 'regular',
        name: '',
        email: ''
    }

    getUser(): Promise<any> {
        return this.afAuth.authState.pipe(take(1)).toPromise();
      }

    getUserAuth(coll?: string, docId?: string) {
        if (!coll) { coll = this._userAuthColl; }
        if (!docId) { docId = this.authState.uid }
        return this.getDoc(coll, docId);
    }
    // this method is used when user logs in first time
    setUserAuth(uid, uname, phoneNumber, email, photoURL) {
        let data =
            {
                'authuid': uid,
                'authuname': uname,
                'authphoneNumber': phoneNumber,
                'authemail': email,
                'authphoto': photoURL
            };
        this.setExistingDoc(this._userAuthColl, uid, data);
    }

    //helper functions// get local or serverTimestamp

    setUser(formData: any, coll?: string, docId?: string) {
        if (!coll) { coll = this._userAuthColl; }
        if (!docId) { docId = this.authState.uid }
        //return this.setExistingDoc(coll, docId, formData);
        this.setExistingDoc(coll, docId, formData);
    }

    getCustomers(coll?: string, docId?: string, filters?: any) {
        coll = this._userColl + "/" + localStorage.getItem('eCRMkeyC') + "/" + this.getCollectionURL(coll);
        //if (!docId) { docId = localStorage.getItem('eCRMkeyI'); }
        return this.getDocs(coll);
        //console.log(coll);
    }
    getFilterCustomers(coll: string, filters: any) {
        coll = this._userColl + "/" + localStorage.getItem('eCRMkeyC') + "/" + this.getCollectionURL(coll);
        //if (!docId) { docId = localStorage.getItem('eCRMkeyI'); }
        return this.getDocs(coll, filters);
        //console.log(coll);
    }

    setCustomer(coll: string, formData: any, docId?: string) {
        coll = this._userColl + "/" + localStorage.getItem('eCRMkeyC') + "/" + coll;
        return this.setNewDoc(coll, formData);
    }
    getCustomerDoc(coll: string, docId?: string, coll_userdb?: string, userId?: string) {
        if (!coll_userdb) { coll_userdb = this._userColl; }
        if (!userId) { userId = localStorage.getItem('eCRMkeyC'); }
        coll = coll_userdb + "/" + userId + "/" + this.getCollectionURL(coll);
        return this.getDoc(coll, docId);
    }
    updateCustomerDoc(coll: string, formData: any, docId?: string, coll_userdb?: string, userId?: string) {
        if (!coll_userdb) { coll_userdb = this._userColl; }
        if (!userId) { userId = localStorage.getItem('eCRMkeyC'); }
        coll = coll_userdb + "/" + userId + "/" + this.getCollectionURL(coll);
        return this.updateDoc(coll, docId, formData);
    }
    deleteCustomerDoc(coll: string, docId?: string, coll_userdb?: string, userId?: string) {
        if (!coll_userdb) { coll_userdb = this._userColl; }
        if (!userId) { userId = localStorage.getItem('eCRMkeyC'); }
        coll = coll_userdb + "/" + userId + "/" + this.getCollectionURL(coll);
        let formData = { "delete_flag": "Y" }
        return this.deleteDoc(coll, docId);
    }

    // helper functions
    /**
    OLD_Method_getDocs(coll: string, filters?: any) {
        if (localStorage.getItem('eCRMkeyA') == '7PjNil') { //not an admin user
            if (filters) {
                if (filters.name > "") {
                    return this.afs.collection(coll, ref =>
                        ref.where('name', '>=', filters.name)
                            .where('delete_flag', '==', 'N')
                            .where('useremail', '==', localStorage.getItem('eCRMkeyE'))
                            .limit(this.getMemberType().counter)
                            .orderBy('name', 'desc')
                    )
                        .snapshotChanges().map(actions => {
                            return actions.map(a => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                return { id, ...data };
                            });
                        });
                }
                if (filters.phone > 0) {
                    return this.afs.collection(coll, ref =>
                        ref.where('phone', '>=', filters.phone)
                            .where('delete_flag', '==', 'N')
                            .where('useremail', '==', localStorage.getItem('eCRMkeyE'))
                            .limit(this.getMemberType().counter)
                            .orderBy('phone', 'desc')
                    )
                        .snapshotChanges().map(actions => {
                            return actions.map(a => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                return { id, ...data };
                            });
                        });
                } else {
                    let fromDt = new Date(filters.fromdt);
                    let toDt = new Date(filters.todt);
                    return this.afs.collection(coll, ref =>
                        ref.where('updatedAt', '>=', fromDt)
                            .where('updatedAt', '<', toDt)
                            .where('delete_flag', '==', 'N')
                            .where('useremail', '==', localStorage.getItem('eCRMkeyE'))
                            .limit(this.getMemberType().counter)
                            .orderBy('updatedAt', 'desc')
                    )
                        .snapshotChanges().map(actions => {
                            return actions.map(a => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                return { id, ...data };
                            });
                        });
                }
            } else {
                return this.afs.collection(coll, ref =>
                    ref.where('delete_flag', '==', 'N')
                        .where('useremail', '==', localStorage.getItem('eCRMkeyE'))
                        .limit(this.getMemberType().counter)
                        .orderBy('name')
                        .orderBy('updatedAt', "desc"))
                    .snapshotChanges().map(actions => {
                        return actions.map(a => {
                            const data = a.payload.doc.data();
                            const id = a.payload.doc.id;
                            return { id, ...data };
                        });
                    });
            }
        } else { // an admin user
            if (filters) {
                if (filters.name > "") {
                    return this.afs.collection(coll, ref =>
                        ref.where('name', '>=', filters.name)
                            .where('delete_flag', '==', 'N')
                            .limit(this.getMemberType().counter)
                            .orderBy('name', 'desc')
                    )
                        .snapshotChanges().map(actions => {
                            return actions.map(a => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                return { id, ...data };
                            });
                        });
                }
                if (filters.phone > 0) {
                    return this.afs.collection(coll, ref =>
                        ref.where('phone', '>=', filters.phone)
                            .where('delete_flag', '==', 'N')
                            .limit(this.getMemberType().counter)
                            .orderBy('phone', 'desc')
                    )
                        .snapshotChanges().map(actions => {
                            return actions.map(a => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                return { id, ...data };
                            });
                        });
                } else {
                    let fromDt = new Date(filters.fromdt);
                    let toDt = new Date(filters.todt);
                    return this.afs.collection(coll, ref =>
                        ref.where('updatedAt', '>=', fromDt)
                            .where('updatedAt', '<', toDt)
                            .where('delete_flag', '==', 'N')
                            .limit(this.getMemberType().counter)
                            .orderBy('updatedAt', 'desc')
                    )
                        .snapshotChanges().map(actions => {
                            return actions.map(a => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                return { id, ...data };
                            });
                        });
                }
            } else {
                return this.afs.collection(coll, ref =>
                    ref.where('delete_flag', '==', 'N')
                        .limit(this.getMemberType().counter)
                        .orderBy('name')
                        .orderBy('updatedAt', "desc"))
                    .snapshotChanges().map(actions => {
                        return actions.map(a => {
                            const data = a.payload.doc.data();
                            const id = a.payload.doc.id;
                            return { id, ...data };
                        });
                    });
            }
        }
    }
    */

    OLD_Method_setNewDoc(coll: string, data: any, docId?: any) {
        const id = this.afs.createId();
        const item = { id, name };
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(item.id);
        return docRef.set({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp,
            delete_flag: "N",
            username: localStorage.getItem('eCRMkeyN'),
            useremail: localStorage.getItem('eCRMkeyE')
        });
    }

    OLD_Method_updateDoc(coll: string, docId: string, data: any) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.update({
            ...data,
            updatedAt: timestamp,
            delete_flag: "N",
            username: localStorage.getItem('eCRMkeyN'),
            useremail: localStorage.getItem('eCRMkeyE')
        });
    }
    OLD_Method_deleteDoc(coll: string, docId: string) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.update({
            updatedAt: timestamp,
            delete_flag: "Y",
            username: localStorage.getItem('eCRMkeyN'),
            useremail: localStorage.getItem('eCRMkeyE')
        });
    }
}