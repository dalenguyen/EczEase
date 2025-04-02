# EczEase

Eczema & Food Allergy Tech Solution

Web: https://eczease.com

> Looking for immediate help with allergy-friendly meal planning? Try 🍽️ **[SafePlate.ai (Beta)](https://SafePlate.ai)** — an iOS app designed to make dining safer and more enjoyable for people with food allergies.

## Development

This project uses [pnpm](https://pnpm.io/) for package management. Please ensure you have it installed (`npm install -g pnpm`) and use `pnpm install` instead of `npm install` or `yarn install`.

Set up default GCP project

```bash
gcloud auth application-default login
gcloud config set project YOUR_GCP_PROJECT
```

Change the `.env-template` to `.env` and enter your missing environment data.

Run the project

```bash
npx nx serve webapp
```

## Roadmap

This project involves developing a tech platform to support individuals with eczema and food allergies. The platform will include:

- **AI Chatbot**: Provides personalized advice and guidance on managing eczema, focusing on diet and lifestyle adjustments.
- **Symptom Tracking**: Users can log symptoms, food intake, and treatments to identify potential triggers and monitor progress.
- **Naturopath Directory**: A global directory of naturopathic practitioners specializing in skin conditions, allowing users to find local experts.
- **Educational Content**: Evidence-based articles and guides on eczema management, dietary interventions, and allergy awareness.
- **Community Support**: Forums for users to share experiences and receive support from peers and experts.

The goal is to empower users with actionable insights and resources to improve their condition while fostering a supportive community.

## Contributing

We welcome contributions to the EczEase project! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
