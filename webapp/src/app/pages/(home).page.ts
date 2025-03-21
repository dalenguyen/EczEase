import { Component } from '@angular/core'
import { LandingPageComponent } from '../components/landing-page.component'
import { RouteMeta } from '@analogjs/router'

export const routeMeta: RouteMeta = {
  title: 'EczEase - Your guide to eczema',

  meta: [
    { name: 'og:title', content: 'EczEase - Your guide to eczema' },
    {
      name: 'og:description',
      content: 'EczEase is your guide to eczema. We provide personalized eczema care plans and resources to help you manage your condition.',
    },
    { name: 'og:url', content: 'https://eczease.com' },
    {
      name: 'og:image',
      content: 'https://eczease.com/assets/images/logo.webp',
    },
    { name: 'type', content: 'website' },
  ],
}

@Component({
  selector: 'webapp-home',
  imports: [LandingPageComponent],
  template: ` <webapp-landing-page /> `,
})
export default class HomeComponent {}
