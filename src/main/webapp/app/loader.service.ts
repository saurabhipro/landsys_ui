import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  currentStatus = false;
  /**
     * @ngdoc method
     * @name show
     * @methodOf LoaderService
     * @description
     * This method is show/ hide loader 
     * @ Param value 
     */
    show(value: boolean) : void{
     
      this.currentStatus = value;
  }
}
