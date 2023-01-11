import { Component, OnInit, OnDestroy, Input, OnChanges, EventEmitter,Output } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';
import IClip from 'src/app/models/clip.modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip|null = null
  clipID = new FormControl('', {
    nonNullable: true
  })
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })

  showAlert = false
  alertMessage = "Updating..."
  alertColor = "blue"
  inSubmission = false
  @Output() update = new EventEmitter()

  constructor(private model:ModelService, private clips:ClipService) { }

  ngOnInit(): void {
    this.model.register('editClip')
  }

  ngOnDestroy (): void {
    this.model.unregister('editClip')
  }
  
  ngOnChanges(): void {
    if (!this.activeClip){
      return
    }
    this.showAlert = false
    this.inSubmission = false
    this.clipID.setValue(this.activeClip.docID as string)
    this.title.setValue(this.activeClip.title)
  }

  async submit() {
  if (!this.activeClip) {
    return
  }
  this.showAlert = true
  this.alertMessage = "Updating..."
  this.alertColor = "blue"
  this.inSubmission = true

  try {
    await this.clips.updateClip(this.clipID.value, this.title.value)
  }
  catch(e){
    this.inSubmission = false
    this.alertMessage = "Error"
      this.alertColor = "red"  
      return
  }
  this.activeClip.title = this.title.value
  this.update.emit(this.activeClip)
  this.inSubmission = false
  this.alertMessage = "Success!"
    this.alertColor = "green"  

  }
}
