import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http'
import { provideClientHydration } from '@angular/platform-browser'
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router'
import { ContentRenderer, MarkdownContentRendererService, MarkedSetupService, provideContent, withMarkdownRenderer } from '@analogjs/content'
import { provideAnalytics } from './providers/analytics.provider'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

//
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
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
    // Initialize Microsoft Clarity
    provideAnalytics({
      projectId: 'ri5h2tkf0b',
    }),
  ],
}
