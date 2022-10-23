import { Component, Input, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
 // ,providers: [ModelService]
})
export class ModelComponent implements OnInit,OnDestroy {
  @Input() ModelID = ''
  constructor(public model : ModelService, public el : ElementRef) {
   }

  ngOnInit(): void {
    document.body.append(this.el.nativeElement)
  }
  
  closeModel(){
    this.model.toggleVisibilty(this.ModelID);
  }

  ngOnDestroy(){
    document.body.removeChild(this.el.nativeElement)
  }
}
