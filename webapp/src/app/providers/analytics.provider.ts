import { EnvironmentProviders } from '@angular/core'
import Clarity from '@microsoft/clarity'
import { provideAppInitializer } from '@angular/core'

/**
 * Initializes Microsoft Clarity with the given project ID
 * @param projectId The Microsoft Clarity project ID
 * @returns A function that initializes Clarity
 */
export function initializeClarity(projectId: string): () => Promise<void> {
  return () => {
    return new Promise<void>((resolve) => {
      // Only initialize in the browser, not during SSR
      if (typeof window !== 'undefined') {
        // Initialize Clarity with the project ID
        Clarity.init(projectId)
      }
      resolve()
    })
  }
}

/**
 * Provides Microsoft Clarity integration
 * @param projectId Your Microsoft Clarity project ID
 * @returns Providers for Microsoft Clarity
 */
export function provideAnalytics(options: { projectId: string }): EnvironmentProviders {
  return provideAppInitializer(initializeClarity(options.projectId))
}
