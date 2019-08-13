import { Injectable, EventEmitter, Output } from "@angular/core";
import { Subject } from "rxjs";
import { LoaderState } from "./loading.model";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loadingValue = 0;
  private loaderSubject = new Subject<LoaderState>();
  private loaderValueSubject = new Subject();
  loaderState = this.loaderSubject.asObservable();
  loaderValue = this.loaderValueSubject.asObservable();
  constructor() { }
  show() {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }
  hide() {
    this.loaderSubject.next(<LoaderState>{ show: false });
  }
  setLoadingValue(value) {
    this.loaderValueSubject.next(value);
  }
}