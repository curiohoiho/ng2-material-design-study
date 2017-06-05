import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'home-component',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

    public message: string;

    constructor() {
        this.message = 'Things from the ASP.NET Core API';
    }

    ngOnInit() {
        // this.getAllThings();
    }

} // class HomeComponent
