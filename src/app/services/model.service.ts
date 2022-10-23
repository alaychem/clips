import { Injectable } from '@angular/core';

interface IModel {
  id : string;
  visiable : boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ModelService {
  public models: IModel[] = []
  
  constructor() {
   }
  
  register (id : string){
  this.models.push ({id, visiable : false})
   }

    unregister (id : string){
    this.models = this.models.filter(element => element.id !== id)
     }

  isVisiable (id : string) {
    return Boolean(this.models.find(element => element.id === id)?.visiable)
  }

  toggleVisibilty (id: string) {
     const model = this.models.find(element => element.id === id)
    if (model){
     model.visiable = !model.visiable}
  }
}
