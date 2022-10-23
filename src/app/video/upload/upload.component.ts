import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(private storage : AngularFirestore) { 

  }
  IsDragover=false;
  nextStep=false;
  file : File | null = null;
  title = new FormControl('',{validators : [Validators.required, Validators.minLength(3)], nonNullable : true});
  uploadForm = new FormGroup({
    title : this.title
  })


  ngOnInit(): void {
  }

  storeFile($event: Event): void {
    this.IsDragover = false
    this.nextStep = false

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null
    if (!this.file || this.file.type != 'video/mp4'){
      return
    }
   this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ""))
    this.nextStep = true
  }

  uploadFile() {
    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`
    this.storage.upload(clipPath, this.file)
  }

}
