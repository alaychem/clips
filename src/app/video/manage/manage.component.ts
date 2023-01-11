import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.modal';
import { ModelService } from 'src/app/services/model.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private model: ModelService) {
    this.sort$ = new BehaviorSubject(this.videoOrder)

  }
  videoOrder = '1'
  clips: IClip[] = []
  activeClip: IClip | null = null
  sort$: BehaviorSubject<string>

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params.sort == '2' ? params.sort : '1'
      this.sort$.next(this.videoOrder)
    })
    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = []

      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    })
  }

  sort(event: Event) {
    console.log('poop')
    const { value } = (event.target as HTMLSelectElement)
    this.router.navigate([], { relativeTo: this.route, queryParams: { sort: value } })
  }

  openModel($event: Event, clip: IClip) {
    $event.preventDefault()
    this.activeClip = clip
    this.model.toggleVisibilty('editClip')

  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault()
    this.clipService.deleteClip(clip)
    this.clips.forEach((element, index) => {
      if (element.docID == clip.docID) {
        this.clips.splice(1, index)
      }
    }
    )
  }

  update($event: IClip) {
    this.clips.forEach((element, index) => {
      if (element.docID == $event.docID) {
        this.clips[index].title = $event.title
      }
    }
    )
  }
}


