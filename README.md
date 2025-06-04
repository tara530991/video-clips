# Video Clips

A React-based video clip preview tool that helps you manage and preview video clip effects.

## Features

- Video upload and management
- Automatic video subtitle generation
- Highlight important segments
- Manual selection and marking of highlights
- Timeline visualization
- Multiple playback modes

## Tech Stack

- React 18
- React Router
- React Query
- TailwindCSS
- Supabase (Video Storage)
- Axios

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation Steps

1. Clone the repository

```bash
git clone https://github.com/tara530991/video-clips.git
cd video-clips
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp .env.example .env
```

4. Configure environment variables
   Add the following configurations to your `.env` file:

```
REACT_APP_SUPABASE_URL=your_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY=your_SUPABASE_ANON_KEY
REACT_APP_API_BASE_URL=your_API_BASE_URL
```

5. Start development server

```bash
npm start
```

## Deployment

This project is deployed using GitHub Pages. Every push to the `main` branch triggers GitHub Actions to automatically build and deploy to GitHub Pages.

### Deployment Steps

1. Ensure all changes are committed and pushed to the `main` branch
2. GitHub Actions will automatically:
   - Install dependencies
   - Build the project
   - Deploy to GitHub Pages

## Project Structure

```
video-clips/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   └── App.js          # Application entry
├── .github/            # GitHub configuration
│   └── workflows/      # GitHub Actions workflows
└── package.json        # Project configuration
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contact

- GitHub: [@tara530991](https://github.com/tara530991)
