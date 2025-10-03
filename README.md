# ZenaTrust Bank - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, responsive banking application frontend built with Next.js 14, React, TypeScript, and Tailwind CSS. Provides a seamless user experience for managing accounts, transfers, crypto trading, and more.

![ZenaTrust Dashboard](https://via.placeholder.com/800x400/03305c/ffffff?text=ZenaTrust+Banking+Dashboard)

## Features

**Modern UI/UX**
- Responsive design for all devices
- Dark/light mode support
- Smooth animations and transitions
- Intuitive navigation

**User Authentication**
- Secure login and registration
- Email verification with OTP
- Password reset functionality
- Remember me functionality

**Dashboard**
- Account overview
- Transaction history
- Quick actions
- Real-time balance updates

**Banking Features**
- Internal and external transfers
- Multi-currency support (20+ currencies)
- Transaction search and filtering
- Transfer PIN security
- OTP verification

**Cryptocurrency**
- Buy and sell crypto
- Multiple wallet management
- Real-time price tracking
- Transaction history

**Card Management**
- Virtual card overview
- Card controls (lock/unlock)
- Transaction monitoring

**Loan Applications**
- Easy loan application process
- Document upload
- Application tracking

**Profile Management**
- Edit personal information
- Upload profile picture
- Security settings
- Notification preferences

**Admin Dashboard**
- User management
- Credit/debit user accounts
- Delete user accounts
- Block/unblock users
- Transaction oversight
- System statistics
- Account balance adjustments

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see [backend repo](https://github.com/nwafor-princewill/bankapp))

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nwafor-princewill/bankapp-fixed.git
   cd bankapp-fixed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # API URL
   NEXT_PUBLIC_API_URL=http://localhost:5000
   
   # Or for production
   # NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will start at `http://localhost:3000`

## Project Structure

```
bankapp-fixed/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── reset-password/
│   ├── dashboard/           # Main dashboard
│   ├── transfers/           # Transfer pages
│   ├── crypto/              # Crypto trading
│   ├── cards/               # Card management
│   ├── loans/               # Loan application
│   ├── profile/             # User profile
│   └── admin/               # Admin dashboard
│       ├── users/           # User management
│       ├── transactions/    # Transaction oversight
│       └── stats/           # System statistics
├── components/
│   ├── auth/                # Auth components
│   ├── dashboard/           # Dashboard components
│   ├── transfers/           # Transfer components
│   ├── admin/               # Admin components
│   ├── ui/                  # Reusable UI components
│   └── layout/              # Layout components
├── lib/                     # Utility functions
├── public/                  # Static assets
├── styles/                  # Global styles
├── types/                   # TypeScript types
├── .env.local               # Environment variables (gitignored)
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API / Zustand
- **Form Handling**: React Hook Form
- **HTTP Client**: Fetch API
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Charts**: Recharts
- **Date Handling**: date-fns

## Pages

### Public Pages
- `/` - Landing page
- `/login` - User login
- `/register` - New user registration
- `/reset-password` - Password reset

### Protected Pages
- `/dashboard` - Main dashboard
- `/transfers` - Transfer management
- `/transfers/new` - Create new transfer
- `/crypto` - Cryptocurrency trading
- `/cards` - Card management
- `/loans` - Loan application
- `/profile` - User profile settings

### Admin Pages (Protected)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/users/:id/credit` - Credit user account
- `/admin/users/:id/debit` - Debit user account
- `/admin/users/:id/delete` - Delete user account
- `/admin/transactions` - Transaction oversight
- `/admin/stats` - System statistics

## Authentication Flow

1. User enters email and name
2. OTP sent to email
3. User verifies OTP
4. User completes registration form
5. ID document upload and verification
6. Account created successfully
7. JWT token stored in localStorage
8. User redirected to dashboard

## UI Components

### Custom Components
- `AuthModals` - Login/Register modals
- `DashboardCard` - Reusable dashboard cards
- `TransactionList` - Transaction display
- `TransferForm` - Transfer form with validation
- `CryptoCard` - Cryptocurrency display
- `CardDisplay` - Virtual card display
- `AdminUserTable` - User management table
- `AdminStats` - Statistics dashboard
- `Sidebar` - Navigation sidebar
- `Navbar` - Top navigation bar

### UI Elements
- Buttons (primary, secondary, danger)
- Input fields with validation
- Select dropdowns
- File upload with preview
- Modal dialogs
- Toast notifications
- Loading spinners
- Skeleton loaders
- Data tables with pagination
- Charts and graphs

## Admin Features

### User Management
- View all users with search and filters
- Block/unblock user accounts
- Delete user accounts (with confirmation)
- View user details and activity

### Financial Operations
- Credit user accounts (add funds)
- Debit user accounts (remove funds)
- Adjust account balances
- View transaction history

### System Oversight
- Monitor all transactions
- View system statistics
- Generate reports
- Track user activity

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
5. Deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your repository
4. Build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
5. Add environment variables
6. Deploy

## Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | `http://localhost:5000` |

## Features in Development

- [ ] Real-time notifications
- [ ] WebSocket integration for live updates
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Two-factor authentication
- [ ] Biometric authentication
- [ ] Investment portfolio tracking
- [ ] Bill payments
- [ ] Scheduled transfers
- [ ] Export transactions to CSV/PDF

## Known Issues

- File upload size limited to 5MB
- OTP email may go to spam folder
- Session expires after 30 days

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Prince Nwafor**
- GitHub: [@nwafor-princewill](https://github.com/nwafor-princewill)
- Website: [zenatrust.com](https://www.zenatrust.com)

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- Tailwind CSS for the utility-first CSS framework
- The React community

## Support

For support, email support@zenatrust.com or open an issue on GitHub.

## Related Links

- [Backend Repository](https://github.com/nwafor-princewill/bankapp)
- [Live Demo](https://www.zenatrust.com)
- [API Documentation](https://bank-backend-eagz.onrender.com/api-docs)

## Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x500/03305c/ffffff?text=Dashboard+Screenshot)

### Transfers
![Transfers](https://via.placeholder.com/800x500/03305c/ffffff?text=Transfer+Page)

### Admin Panel
![Admin](https://via.placeholder.com/800x500/03305c/ffffff?text=Admin+Dashboard)

---

Built with ❤️ by Princewill Nwafor
