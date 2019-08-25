import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime, startWith, distinctUntilChanged } from 'rxjs/operators';

interface Size {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService {
  constructor() {
    const resizeSubject = new Subject<Size>();
    this.resize$ = resizeSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      startWith({ width: window.innerWidth, height: window.innerHeight }));

    window.onresize = () =>
      resizeSubject.next({ width: window.innerWidth, height: window.innerHeight });
  }

  resize$: Observable<Size>;

  private resizeSubject: Subject<Size>;
}
