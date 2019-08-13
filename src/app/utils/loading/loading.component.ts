import { trigger, style, animate, transition } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from './loading.service';
import { LoaderState } from './loading.model';
declare let $: any;
declare let ProgressBar: any;

@Component({
  selector: 'app-loading',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':leave', [
          style({ opacity: 1}),
          animate('200ms', style({opacity: 0}))
        ])
      ]
    )
  ],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {

  show = false;
  loadingValue = 0;
  private subscription: Subscription;
  constructor(private loaderService: LoadingService) { }
  ngOnInit() {
    this.subscription = this.loaderService.loaderState
    .subscribe((state: LoaderState) => {
      this.show = state.show;
    });

      this.subscription.add(this.loaderService.loaderValue.subscribe((value : any) => {
        this.loadingValue = value;
      }))
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
}
