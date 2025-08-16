# Frontend - Auth App

This is the frontend for the authentication system built with Next.js, TypeScript, and shadcn/ui.

## Features

- ✅ Modern, responsive UI with shadcn/ui components
- ✅ User authentication (Sign In/Sign Up)
- ✅ Profile management with image upload
- ✅ User listing and browsing
- ✅ Google OAuth integration (ready for implementation)
- ✅ Form validation and error handling
- ✅ Beautiful gradient designs and animations

## Pages

### Public Pages
- **Home** (`/`) - Landing page with intro and CTA buttons
- **Sign In** (`/signin`) - Login form with email/password and Google OAuth
- **Sign Up** (`/signup`) - Registration form with profile picture upload

### Protected Pages (require authentication)
- **Profile** (`/profile`) - View and edit user profile
- **Users** (`/users`) - Browse all registered users

## Components

- **Navbar** - App header with authentication status
- **Sidebar** - Navigation for authenticated users
- **Forms** - Reusable form components with validation

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 3. Connect to Backend

Make sure your backend server is running on `http://localhost:5000` before testing the frontend.

## Project Structure

📁 frontend/
    ├── 📁 .next/ 🚫 (auto-hidden)
    ├── 📁 node_modules/ 🚫 (auto-hidden)
    ├── 📁 public/
    │   ├── 🖼️ file.svg
    │   ├── 🖼️ globe.svg
    │   ├── 🖼️ next.svg
    │   ├── 🖼️ vercel.svg
    │   └── 🖼️ window.svg
    ├── 📁 src/
    │   ├── 📁 app/
    │   │   ├── 📁 (auth)/
    │   │   │   ├── 📁 dashboard/
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 profile/
    │   │   │   │   └── 📄 page.tsx
    │   │   │   ├── 📁 users/
    │   │   │   │   ├── 📁 [userId]/
    │   │   │   │   │   └── 📄 page.tsx
    │   │   │   │   └── 📄 page.tsx
    │   │   │   └── 📄 layout.tsx
    │   │   ├── 📁 complete-profile/
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 signin/
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 signup/
    │   │   │   └── 📄 page.tsx
    │   │   ├── 🖼️ favicon.ico
    │   │   ├── 🎨 globals.css
    │   │   ├── 📄 layout.tsx
    │   │   └── 📄 page.tsx
    │   ├── 📁 components/
    │   │   ├── 📁 ui/
    │   │   │   ├── 📄 alert.tsx
    │   │   │   ├── 📄 button.tsx
    │   │   │   ├── 📄 card.tsx
    │   │   │   ├── 📄 dropdown-menu.tsx
    │   │   │   ├── 📄 input.tsx
    │   │   │   ├── 📄 label.tsx
    │   │   │   └── 📄 select.tsx
    │   │   ├── 📄 Navbar.tsx
    │   │   ├── 📄 PrivateRoute.tsx
    │   │   ├── 📄 Sidebar.tsx
    │   │   ├── 📄 ThemeProvider.tsx
    │   │   └── 📄 ThemeToggle.tsx
    │   └── 📁 lib/
    │       ├── 📄 api.ts
    │       └── 📄 utils.ts
    ├── 🔒 .env 🚫 (auto-hidden)
    ├── 📄 .eslintrc.json
    ├── 🚫 .gitignore
    ├── 📖 README.md
    ├── 📄 components.json
    ├── 📄 eslint.config.mjs
    ├── 📄 next-env.d.ts
    ├── 📄 next.config.ts
    ├── 📄 package-lock.json
    ├── 📄 package.json
    ├── 📄 postcss.config.mjs
    └── 📄 tsconfig.json
```

## Authentication Flow

1. **Sign Up**: Users can create accounts with email/password or Google OAuth
2. **Sign In**: Users can login with their credentials
3. **Token Storage**: JWT tokens are stored in localStorage
4. **Protected Routes**: Authentication is checked on protected pages
5. **Logout**: Users can logout and are redirected to home

## API Integration

The frontend connects to the backend API at `http://localhost:5000`:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users

## Styling

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for beautiful, accessible components
- **Lucide React** for consistent icons
- **Custom gradients** and animations

## Next Steps

1. ✅ Frontend UI is complete
2. 🔄 Connect to backend API
3. 🔄 Test authentication flow
4. 🔄 Add Google OAuth integration
5. 🔄 Deploy application

## Development

### Adding New Pages
1. Create a new folder in `src/app/`
2. Add a `page.tsx` file
3. Import necessary components and hooks

### Adding New Components
1. Create a new file in `src/components/`
2. Export the component
3. Import and use in pages

### Styling
- Use Tailwind CSS classes
- Follow the existing design patterns
- Use shadcn/ui components when possible

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Make sure the backend server is running on port 5000
   - Check that CORS is properly configured

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check that JWT tokens are being sent correctly

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors in the console

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Add proper error handling
4. Test all functionality before committing

Your frontend is now ready to connect with the backend! 🎉
