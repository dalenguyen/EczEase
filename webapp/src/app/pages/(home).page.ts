import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'webapp-home',
  
  imports: [AnalogWelcomeComponent],
  template: `
     <webapp-analog-welcome/>
  `,
})
export default class HomeComponent {
}
