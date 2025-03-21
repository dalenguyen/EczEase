import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "webapp-landing-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
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
                  [disabled]="isSubmitting"
                >
                  <span *ngIf="isSubmitting">
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
                  <span *ngIf="!isSubmitting">Join Waitlist</span>
                </button>
              </form>
              <div
                *ngIf="showSuccess"
                class="mt-3 sm:mt-4 text-green-600 font-medium"
              >
                Thank you for joining our waitlist! We'll keep you updated.
              </div>
              <div
                *ngIf="errorMessage"
                class="mt-3 sm:mt-4 text-red-600 font-medium"
              >
                {{ errorMessage }}
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
          Our AI Chatbot will be launching first, with more exciting features
          coming soon after to enhance your experience.
        </p>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
        >
          <!-- Feature 1 - AI Chatbot (Coming First) -->
          <div
            class="bg-blue-100 p-4 sm:p-6 rounded-lg border-2 border-blue-500 relative"
          >
            <div
              class="absolute top-0 right-0 bg-blue-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-bl-lg rounded-tr-lg"
            >
              COMING FIRST
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
            <p class="text-sm sm:text-base text-gray-600">
              Get personalized advice and guidance on managing eczema, focusing
              on diet and lifestyle adjustments.
            </p>
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
        <p class="text-gray-400">
          &copy; {{ currentYear }} EczEase. All rights reserved.
        </p>
      </div>
    </footer>
  `,
})
export class LandingPageComponent {
  name: string = "";
  email: string = "";
  isSubmitting = false;
  showSuccess = false;
  errorMessage: string | null = null;
  currentYear: number = new Date().getFullYear();

  constructor(private http: HttpClient) {}

  onSubmit(event: Event) {
    event.preventDefault();
    this.isSubmitting = true;
    this.errorMessage = null;

    const name = this.name;
    const email = this.email;

    this.http
      .post<{ success: boolean; message: string }>("/api/v1/newsletter", {
        name,
        email,
      })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;

          if (response.success) {
            this.showSuccess = true;
            this.name = "";
            this.email = "";

            // Hide success message after 5 seconds
            setTimeout(() => {
              this.showSuccess = false;
            }, 5000);
          } else {
            this.errorMessage =
              response.message || "Failed to subscribe to newsletter";
          }
        },
        error: (error) => {
          console.error("Newsletter subscription error:", error);
          this.isSubmitting = false;
          this.errorMessage = "An error occurred. Please try again later.";
        },
      });
  }

  scrollToContact() {
    const contactElement = document.getElementById("contact");
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth" });
    }
  }
}
