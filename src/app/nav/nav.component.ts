import { Component, OnInit } from '@angular/core';
import { ModelService } from '../services/model.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
     public model : ModelService,
     public auth : AuthService) 
     { }

  ngOnInit(): void {
  }

  openModel ($event: Event) {
    $event.preventDefault();
    this.model.toggleVisibilty("auth")

  }
}
