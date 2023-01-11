import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {

  constructor(private storage :AngularFireStorage, 
              private auth: AngularFireAuth, 
              private clipsService : ClipService, 
              private router : Router,
              public ffmpegSvc : FfmpegService
              ) { 
    auth.user.subscribe(user => this.user = user)
    ffmpegSvc.init()
  }
  IsDragover=false;
  nextStep=false;
  file : File | null = null;
  title = new FormControl('',{validators : [Validators.required, Validators.minLength(3)], nonNullable : true});
  uploadForm = new FormGroup({title : this.title })

  showAlert = false
  alertMessage = "Uploading..."
  alertColor = "blue"
  inSubmission = false
  showprecentage = false
  precentage = 0
  user : firebase.User | null = null
  task? :AngularFireUploadTask


  ngOnDestroy(): void {
    this.task?.cancel()
  }

  storeFile($event: Event): void {
    this.IsDragover = false
    this.nextStep = false

    this.file = 
    ($event as DragEvent).dataTransfer ?
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
    ($event.target as HTMLInputElement).files?.item(0) ?? null

    if (!this.file || this.file.type != 'video/mp4'){
      return
    }
   this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ""))
    this.nextStep = true
  }

  uploadFile() {
    this.uploadForm.disable()
    this.showprecentage  =true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMessage = "Uploading..."
    this.inSubmission = true
    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`
    this.task = this.storage.upload(clipPath, this.file)
    const clipRef = this.storage.ref(clipPath)
    this.task.percentageChanges().subscribe(progress => this.precentage = progress as number / 100)
    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
      
      ).subscribe(
      {
          next:async (url) => {
              const clip = {uid: this.user?.uid as string, 
                            displayName: this.user?.displayName as string, 
                            title: this.title.value, 
                            fileNmae: `${clipFileName}.mp4`,
                            url,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                          }
              const clipRef = await this.clipsService.createClip(clip)
              console.log(clip)
              this.alertColor = "green"
              this.alertMessage = "Uploaded"
              this.showprecentage = false

              setTimeout (() => {this.router.navigate(['clip', clipRef.id])}, 1000)
          },
          error:(error) => {
              this.uploadForm.enable()
              this.alertColor = "red"
              this.alertMessage = "Failed"
              this.inSubmission = true
              this.showprecentage = false
              console.log(error)
          }
      }
    )
  }
}
