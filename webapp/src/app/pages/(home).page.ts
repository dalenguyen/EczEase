import { Component } from "@angular/core";
import { LandingPageComponent } from "../components/landing-page.component";

@Component({
  selector: "webapp-home",
  imports: [LandingPageComponent],
  template: ` <webapp-landing-page /> `,
})
export default class HomeComponent {}
