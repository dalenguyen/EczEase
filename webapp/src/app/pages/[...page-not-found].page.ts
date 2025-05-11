import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center">
        <div class="mb-8">
          <h1 class="text-6xl font-bold text-blue-600 mb-2">404</h1>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p class="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              routerLink="/"
              class="inline-flex items-center justify-center bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              Go Home
            </a>
            <a
              routerLink="/chat"
              class="inline-flex items-center justify-center bg-gray-200 text-gray-800 rounded-lg px-6 py-3 font-medium hover:bg-gray-300 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clip-rule="evenodd"
                />
              </svg>
              Chat with AI
            </a>
          </div>
        </div>
        <div class="flex justify-center">
          <img
            src="assets/logo.webp"
            alt="EczEase Logo"
            class="h-10 opacity-75"
          />
        </div>
      </div>
    </div>
  `,
})
export default class PageNotFoundComponent {}
