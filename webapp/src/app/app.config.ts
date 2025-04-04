import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http'
import { provideClientHydration } from '@angular/platform-browser'
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router'
import { ContentRenderer, MarkdownContentRendererService, MarkedSetupService, provideContent, withMarkdownRenderer } from '@analogjs/content'

//
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideContent(withMarkdownRenderer()),
    MarkedSetupService,
    { provide: ContentRenderer, useClass: MarkdownContentRendererService },
    provideFileRouter(),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor])
    ),
  ],
}
