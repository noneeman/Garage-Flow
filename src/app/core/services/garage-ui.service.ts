import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GarageUiService {
  readonly globalSearch = signal('');

  setGlobalSearch(value: string): void {
    this.globalSearch.set(value);
  }
}
