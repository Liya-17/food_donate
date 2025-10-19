# Food Donation Platform - Frontend

Modern, responsive React frontend for the Food Donation Platform.

## Features

- **Authentication**: Login and registration with JWT
- **Real-time Updates**: Socket.io integration for live notifications
- **Donation Management**: Browse, create, and manage donations
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Location-based**: Find donations near you
- **Interactive UI**: Beautiful, intuitive user interface

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Leaflet** - Maps (optional)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on http://localhost:5000

### Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the API URL if needed

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx    # Navigation bar
│   │   └── PrivateRoute.jsx  # Protected route wrapper
│   ├── context/          # React Context
│   │   ├── AuthContext.jsx   # Authentication
│   │   └── SocketContext.jsx # Socket.io
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DonationsList.jsx
│   │   └── CreateDonation.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── utils/            # Utility functions
│   │   └── helpers.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- User registration with role selection (Donor/Receiver)
- Login with JWT token
- Protected routes
- Persistent authentication

### Dashboard
- Statistics overview
- Recent activity
- Quick actions
- User donations

### Donations
- Browse available donations
- Filter by food type, category, status
- View donation details
- Create new donations
- Upload images

### Real-time Features
- Live donation updates
- Instant notifications
- Online/offline status
- Request notifications

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Building for Production

```bash
npm run build
```

The build files will be in the `dist` directory.

## Deployment

You can deploy the built app to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist folder to Netlify
```

## Customization

### Changing Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Update navigation in `src/components/Navbar.jsx`

## API Integration

The frontend connects to the backend API through Axios. All API calls are in `src/services/api.js`.

Example API call:
```javascript
import { donationAPI } from '../services/api';

const donations = await donationAPI.getDonations();
```

## Socket.io Integration

Real-time features are handled through Socket.io Context.

Example usage:
```javascript
import { useSocket } from '../context/SocketContext';

const { socket, connected, notifications } = useSocket();
```

## Troubleshooting

### API Connection Issues
- Ensure backend is running on http://localhost:5000
- Check CORS settings in backend
- Verify API URL in `.env`

### Socket.io Not Connecting
- Check SOCKET_URL in `.env`
- Ensure JWT token is valid
- Check browser console for errors

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm run build --force`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
