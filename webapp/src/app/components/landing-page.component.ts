import { Component, inject, model, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { RouterLink } from '@angular/router'
import { animate, style, transition, trigger } from '@angular/animations'
import { AnalyticsService } from '../services/analytics.service'

@Component({
  selector: 'webapp-landing-page',
  imports: [CommonModule, FormsModule, RouterLink],
  animations: [
    trigger('mobileMenuAnimation', [
      transition(':enter', [
        style({ opacity: 0, height: 0, overflow: 'hidden' }),
        animate('200ms ease-out', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*', overflow: 'hidden' }),
        animate('200ms ease-in', style({ opacity: 0, height: 0 })),
      ]),
    ]),
  ],
  template: `
    <!-- Hero Section -->
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <!-- Navigation -->
      <nav
        class="container mx-auto px-4 sm:px-6 py-4 bg-white rounded-lg shadow-sm mb-4 sm:mb-6"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img
              src="assets/logo.webp"
              alt="EczEase Logo"
              class="h-8 sm:h-10 mr-2 sm:mr-3"
            />
            <span class="text-xl sm:text-2xl font-bold text-blue-600"
              >EczEase</span
            >
          </div>
          <!-- Desktop Menu -->
          <div class="hidden md:flex space-x-6">
            <a
              href="#features"
              class="text-gray-600 hover:text-blue-600 transition duration-300"
              >Features</a
            >
            <a
              href="#about"
              class="text-gray-600 hover:text-blue-600 transition duration-300"
              >About</a
            >
            <a
              href="#contact"
              class="text-gray-600 hover:text-blue-600 transition duration-300"
              >Contact</a
            >
            <a
              routerLink="chat"
              class="text-blue-600 hover:text-blue-800 transition duration-300 flex items-center cursor-pointer"
              (click)="trackChatClick()"
              >
              <span>Chat</span>
              <span class="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">BETA</span>
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <button
            class="md:hidden text-gray-600 focus:outline-none hover:text-blue-600 transition duration-300"
            (click)="toggleMobileMenu()"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                *ngIf="!isMobileMenuOpen()"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                *ngIf="isMobileMenuOpen()"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div
          *ngIf="isMobileMenuOpen()"
          [@mobileMenuAnimation]
          class="md:hidden mt-3 border-t border-gray-200 pt-3"
        >
          <div class="flex flex-col space-y-3">
            <a
              href="#features"
              class="text-gray-600 hover:text-blue-600 transition duration-300 py-1"
              (click)="closeMobileMenu()"
              >Features</a
            >
            <a
              href="#about"
              class="text-gray-600 hover:text-blue-600 transition duration-300 py-1"
              (click)="closeMobileMenu()"
              >About</a
            >
            <a
              href="#contact"
              class="text-gray-600 hover:text-blue-600 transition duration-300 py-1"
              (click)="closeMobileMenu()"
              >Contact</a
            >
            <a
              routerLink="chat"
              class="text-blue-600 hover:text-blue-800 transition duration-300 flex items-center py-1 cursor-pointer"
              (click)="trackChatClickMobile()"
              >
              <span>Chat</span>
              <span class="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">BETA</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="container mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-8 md:mb-0 md:pr-6">
            <h1
              class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4 sm:mb-6"
            >
              Manage Your Eczema & Food Allergies with Confidence
            </h1>
            <p class="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              EczEase is a comprehensive platform designed to help you
              understand, track, and manage your eczema and food allergies with
              personalized solutions.
            </p>

            <!-- Email Collection Form -->
            <div
              id="contact"
              class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <h3
                class="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4"
              >
                Get Early Access
              </h3>
              <p class="text-gray-600 mb-3 sm:mb-4">
                Join our waitlist to be the first to know when we launch.
              </p>
              <form (submit)="onSubmit($event)" class="space-y-3 sm:space-y-4">
                <div>
                  <input
                    type="text"
                    [(ngModel)]="name"
                    name="name"
                    placeholder="Enter your name"
                    class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    placeholder="Enter your email"
                    class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-4 rounded-lg transition duration-300"
                  [disabled]="isSubmitting()"
                >
                  <span *ngIf="isSubmitting()">
                    <svg
                      class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                  <span *ngIf="!isSubmitting()">Join Waitlist</span>
                </button>
              </form>
              <div
                *ngIf="showSuccess()"
                class="mt-3 sm:mt-4 text-green-600 font-medium"
              >
                Thank you for joining our waitlist! We'll keep you updated.
              </div>
              <div
                *ngIf="errorMessage()"
                class="mt-3 sm:mt-4 text-red-600 font-medium"
              >
                {{ errorMessage() }}
              </div>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="md:w-1/2 md:pl-6">
            <img
              src="assets/hero-image.webp"
              alt="Person managing skin health"
              class="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section id="features" class="py-10 sm:py-16 bg-white">
      <div class="container mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6"
        >
          How EczEase Helps You
        </h2>
        <p
          class="text-center text-gray-600 max-w-3xl mx-auto mb-10 sm:mb-16 px-2"
        >
          Our AI Chatbot is now available! Try it today while we work on more exciting features
          coming soon to enhance your experience.
        </p>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
        >
          <!-- Feature 1 - AI Chatbot (Available Now) -->
          <div
            class="bg-blue-100 p-4 sm:p-6 rounded-lg border-2 border-blue-500 relative"
          >
            <div
              class="absolute top-0 right-0 bg-green-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-bl-lg rounded-tr-lg"
            >
              AVAILABLE NOW
            </div>
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-200 rounded-full flex items-center justify-center mb-3 sm:mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 sm:h-8 sm:w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              AI Chatbot
            </h3>
            <p class="text-sm sm:text-base text-gray-600 mb-3">
              Get personalized advice and guidance on managing eczema, focusing
              on diet and lifestyle adjustments.
            </p>
            <a
              routerLink="chat"
              (click)="trackAIChatTryNow()"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg text-sm transition duration-300"
            >
              Try it now
            </a>
          </div>

          <!-- Feature 2 - Coming Soon -->
          <div class="bg-blue-50 p-4 sm:p-6 rounded-lg relative">
            <div
              class="absolute top-0 right-0 bg-gray-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-bl-lg rounded-tr-lg"
            >
              COMING SOON
            </div>
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 sm:h-8 sm:w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Symptom Tracking
            </h3>
            <p class="text-sm sm:text-base text-gray-600">
              Log symptoms, food intake, and treatments to identify potential
              triggers and monitor progress.
            </p>
          </div>

          <!-- Feature 3 - Coming Soon -->
          <div class="bg-blue-50 p-4 sm:p-6 rounded-lg relative">
            <div
              class="absolute top-0 right-0 bg-gray-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-bl-lg rounded-tr-lg"
            >
              COMING SOON
            </div>
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 sm:h-8 sm:w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Naturopath Directory
            </h3>
            <p class="text-sm sm:text-base text-gray-600">
              Find naturopathic practitioners specializing in skin conditions in
              your local area.
            </p>
          </div>

          <!-- Feature 4 - Coming Soon -->
          <div class="bg-blue-50 p-4 sm:p-6 rounded-lg relative">
            <div
              class="absolute top-0 right-0 bg-gray-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-bl-lg rounded-tr-lg"
            >
              COMING SOON
            </div>
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 sm:h-8 sm:w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Educational Content
            </h3>
            <p class="text-sm sm:text-base text-gray-600">
              Access evidence-based articles and guides on eczema management and
              dietary interventions.
            </p>
          </div>
        </div>
      </div>

      <!-- SafePlate Note -->
      <div class="container mx-auto px-4 sm:px-6 mt-8 text-center">
        <p class="text-gray-600 italic max-w-3xl mx-auto">
          <i>Looking for immediate help with allergy-friendly meal planning? Try <a href="https://safeplate.ai/" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 transition-colors duration-300">SafePlate.ai</a> — an iOS app designed to make dining safer and more enjoyable for people with food allergies.</i>
        </p>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-10 sm:py-16 bg-blue-50">
      <div class="container mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-10"
        >
          About EczEase
        </h2>
        <div class="max-w-3xl mx-auto text-center px-2">
          <p class="text-lg sm:text-xl text-gray-600 mb-4 sm:mb-8">
            EczEase was created to empower individuals with eczema and food
            allergies to take control of their health through technology.
          </p>
          <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8">
            Our mission is to provide actionable insights and resources that
            improve quality of life for those managing these conditions, while
            fostering a supportive community.
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-6 sm:py-8">
      <div class="container mx-auto px-4 sm:px-6 text-center">
        <div class="flex justify-center space-x-4 mb-3">
          <a
            href="https://x.com/EczEase"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="Follow us on X/Twitter"
          >
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </svg>
          </a>
          <a
            href="https://github.com/dalenguyen/EczEase"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="View our GitHub repository"
          >
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              />
            </svg>
          </a>
        </div>
        <p class="text-gray-400">
          &copy; {{ currentYear }} EczEase. All rights reserved.
        </p>
      </div>
    </footer>
  `,
})
export class LandingPageComponent {
  private readonly http = inject(HttpClient)
  private readonly analytics = inject(AnalyticsService)

  name = model<string>('')
  email = model<string>('')
  isSubmitting = signal<boolean>(false)
  showSuccess = signal<boolean>(false)
  errorMessage = signal<string | null>(null)
  currentYear: number = new Date().getFullYear()
  isMobileMenuOpen = signal<boolean>(false)

  onSubmit(event: Event) {
    event.preventDefault()
    this.isSubmitting.set(true)
    this.errorMessage.set(null)

    // Validate name and email
    if (!this.name() || this.name().trim() === '') {
      this.errorMessage.set('Name is required')
      this.isSubmitting.set(false)
      return
    }

    if (!this.email() || this.email().trim() === '') {
      this.errorMessage.set('Email is required')
      this.isSubmitting.set(false)
      return
    }

    this.http
      .post<{ success: boolean; message: string }>('/api/v1/newsletter', {
        name: this.name(),
        email: this.email(),
      })
      .subscribe({
        next: (response) => {
          this.isSubmitting.set(false)

          if (response.success) {
            this.showSuccess.set(true)
            this.name.set('')
            this.email.set('')

            // Hide success message after 5 seconds
            setTimeout(() => {
              this.showSuccess.set(false)
            }, 5000)
          } else {
            this.errorMessage.set(
              response.message || 'Failed to subscribe to newsletter'
            )
          }
        },
        error: (error) => {
          console.error('Newsletter subscription error:', error)
          this.isSubmitting.set(false)
          this.errorMessage.set('An error occurred. Please try again later.')
        },
      })
  }

  scrollToContact() {
    const contactElement = document.getElementById('contact')
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen())
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false)
  }

  trackChatClick(): void {
    this.analytics.trackEvent('navigation_chat_click')
  }

  trackChatClickMobile(): void {
    this.analytics.trackEvent('navigation_chat_click_mobile')
    this.closeMobileMenu()
  }

  trackAIChatTryNow(): void {
    this.analytics.trackEvent('ai_chat_try_now_button_click')
  }
}
