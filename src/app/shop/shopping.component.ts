import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
//import { dataSource } from '@angular/cdk/collections';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseService } from '../services/firebase.service';

@Component({
    selector: 'shopping',
    templateUrl: './shopping.component.html',
    styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit, OnDestroy {

    isLoggedin;
    members: Observable<any>;
    //members: any;
    //members: any[];
    dataSource: MatTableDataSource<any>;
    myDocData;
    data;
    currentDate;
    currentDate7;
    toggle: boolean = true;
    state: string = '';
    savedChanges = false;
    error: boolean = false;
    errorMessage: String = "";
    dataLoading: boolean = false;
    private querySubscription;

    profileUrl: Observable<string | null>;
    takeHostSelfie = false;
    showHostSelfie = false;
    myDocId;
    counter = 0;

    constructor(private _backendService: FirebaseService, private _storage: AngularFireStorage) { }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.members = this._backendService.getProducts('product');
    }

    getFilterData(filters) {
        if (filters) {
            this.members = this._backendService.getFilterProducts('product', filters);
        } else {
            this.getData();
        }
    }

    setData(formData) {
        this.dataLoading = true;
        this._backendService.setProduct('product', formData).then((res) => {
            this.savedChanges = true;
            this.dataLoading = false;
        }).catch(error => {
            this.error = true;
            this.errorMessage = error.message;
            this.dataLoading = false;
        });
    }

    getPic(picId) {
        const ref = this._storage.ref(picId);
        this.profileUrl = ref.getDownloadURL();
    }

    showDetails(item) {
        this.counter = 0;
        this.myDocData = item;
        this.getPic(item.path);
        // capture user interest event, user has looked into product details
        this.dataLoading = true;
        let data = item;
        return this._backendService.updateShoppingInterest('interests',data).then((success)=> {
            this.dataLoading = false;
        });
    }
    countProd(filter) {
        if (filter == "add") {
            this.counter = this.counter + 1;
        } else {
            if (this.counter > 0) {
                this.counter = this.counter - 1;
            }
        }
    }
    addToCart(item, counter){
        this.dataLoading = true;
        let data = item;
        data.qty = counter;
        return this._backendService.updateShoppingCart('cart',data).then((success)=> {
            this.dataLoading = false;
            this.counter=0;
            this.savedChanges=true;
        });
    }

    ngOnDestroy() {
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
        }
    }
}