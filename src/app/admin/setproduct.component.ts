import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
// import { DataSource } from '@angular/cdk/collections';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseService } from '../services/firebase.service';

@Component({
    selector: 'set-product',
    templateUrl: './setproduct.component.html'
})
export class SetProductComponent implements OnInit, OnDestroy {

    members: any[];
    dataSource: MatTableDataSource<any>;
    myDocData;
    data;
    currentDate;
    currentDate7;
    toggleField: string;
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

    // @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    displayedColumns = ['category', 'scategory', 'name', 'price', '_id'];

    constructor(private _backendService: FirebaseService, private _storage: AngularFireStorage) { }

    ngOnInit() {
        this.toggleField = "searchMode";
        this.dataSource = new MatTableDataSource(this.members);
        this.currentDate = new Date();
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.currentDate7 = new Date();
        this.currentDate7.setDate(this.currentDate.getDate() - 7);
    }

    toggle(filter?) {
        this.dataLoading = false;
        if (!filter) { filter = "searchMode" }
        else { filter = filter; }
        this.toggleField = filter;
    }

    getData() {
        this.dataLoading = true;
        this.querySubscription = this._backendService.getProducts('product')
            .subscribe(members => {
                this.members = members;
                this.dataSource = new MatTableDataSource(members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }
    getFilterData(filters){
        this.dataLoading = true;
        this.querySubscription = this._backendService.getFilterProducts('product',filters)
            .subscribe(members => {
                this.members = members;
                this.dataSource = new MatTableDataSource(members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }

    setData(formData) {
        formData.tags = formData.tags.split(',');
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

    updateData(formData) {
        formData.tags = formData.tags.split(',');
        if (confirm("Are you sure want to update this record ?")) {
            this.dataLoading = true;
            this._backendService.updateProduct('product', formData).then((res) => {
                this.error = false;
                this.errorMessage = "";
                this.dataLoading = false;
                this.savedChanges = true;
            }).catch(error => {
                this.error = true;
                this.errorMessage = error.message;
                this.dataLoading = false;
            });
        }
    }

    getPic(picId) {
        const ref = this._storage.ref(picId);
        this.profileUrl = ref.getDownloadURL();
    }
    deleteProductPic(docId){
        if (confirm("Are you sure want to delete this picture ?")) {
        this._backendService.deleteProductPic('product',docId);
        }
    }

    getDoc(docId) {
        this.dataLoading = true;
        this.querySubscription = this._backendService.getProduct('product', docId)
            .subscribe(res => {
                this.myDocData = res;
                this.toggle('editMode');
                this.dataLoading = false;
            },
                (error) => {
                    this.error = true;
                    this.errorMessage = error.message;
                    this.dataLoading = false;
                },
                () => { this.error = false; this.dataLoading = false; });
    }

    deleteDoc(docId) {
        if (confirm("Are you sure want to delete this record ?")) {
            this.dataLoading = true;
            this._backendService.deleteProduct('product', docId).then((res) => {
                this.error = false;
                this.errorMessage = "";
                this.dataLoading = false;
                this.toggle('searchMode');
            }).catch(error => {
                this.error = true;
                this.errorMessage = error.message;
                this.dataLoading = false;
            });
        }
    }

    //mat table paginator and filter functions
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    // applyFilter(filterValue: string) {
    //     filterValue = filterValue.trim(); // Remove whitespace
    //     filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    //     this.dataSource.filter = filterValue;
    // }
    ngOnDestroy() {

        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
        }
    }
}