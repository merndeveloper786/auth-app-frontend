# Frontend - Auth App

This is the frontend for the authentication system built with **Next.js**, **TypeScript**, and **shadcn/ui**.

---

## 🚀 Features

- ✅ Modern, responsive UI with **shadcn/ui** components  
- ✅ User authentication (**Sign In / Sign Up**)  
- ✅ Profile management with image upload  
- ✅ User listing and browsing  
- ✅ Google OAuth integration (ready for implementation)  
- ✅ Form validation and error handling  
- ✅ Beautiful gradient designs and animations  

---

## 📄 Pages

### 🌐 Public Pages
- **Home** (`/`) → Landing page with intro and CTA buttons  
- **Sign In** (`/signin`) → Login form with email/password and Google OAuth  
- **Sign Up** (`/signup`) → Registration form with profile picture upload  

### 🔒 Protected Pages (require authentication)
- **Profile** (`/profile`) → View and edit user profile  
- **Users** (`/users`) → Browse all registered users  

---

## 🧩 Components

- **Navbar** → App header with authentication status  
- **Sidebar** → Navigation for authenticated users  
- **Forms** → Reusable form components with validation  

---

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
➡️ The app will be available at [http://localhost:3000](http://localhost:3000)

### 3. Connect to Backend
Make sure your backend server is running on **`http://localhost:5000`** before testing the frontend.

---

## 📂 Project Structure

```
📁 frontend/
├── 📁 .next/ 🚫 (auto-generated)
├── 📁 node_modules/ 🚫 (auto-generated)
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
├── 🔒 .env 🚫 (hidden)
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

---

## 🔑 Authentication Flow

1. **Sign Up** → Users can create accounts with email/password or Google OAuth  
2. **Sign In** → Users log in with their credentials  
3. **Token Storage** → JWT tokens stored in `localStorage`  
4. **Protected Routes** → Authentication is checked before page load  
5. **Logout** → Clears session and redirects to home  

---

## 🌐 API Integration

The frontend connects to the backend API at **`http://localhost:5000`**:

- `POST /api/auth/signup` → User registration  
- `POST /api/auth/login` → User login  
- `GET /api/users/profile` → Get user profile  
- `PUT /api/users/profile` → Update user profile  
- `GET /api/users` → Get all users  

---

## 🎨 Styling

- **Tailwind CSS** → Utility-first styling  
- **shadcn/ui** → Accessible and modern UI components  
- **Lucide React** → Clean and consistent icons  
- **Custom gradients** + animations for modern look  

---

## 📌 Next Steps

- ✅ Frontend UI completed  
- 🔄 Connect frontend to backend API  
- 🔄 Test authentication flow  
- 🔄 Add Google OAuth integration  
- 🔄 Deploy application  

---

## 🛠️ Development Guide

### Adding New Pages
1. Create a new folder in `src/app/`  
2. Add a `page.tsx` file  
3. Import components & hooks  

### Adding New Components
1. Create a new file in `src/components/`  
2. Export the component  
3. Import into pages  

### Styling Guidelines
- Use **Tailwind CSS classes**  
- Follow existing design patterns  
- Use **shadcn/ui** wherever possible  

---

## 🐛 Troubleshooting

**1. Backend Connection Error**  
- Ensure backend server is running on port `5000`  
- Verify CORS settings  

**2. Authentication Issues**  
- Clear `localStorage` and try again  
- Check if JWT tokens are sent correctly  

**3. Build Errors**  
- Run `npm install` to install dependencies  
- Fix TypeScript errors in console  

---

## 🤝 Contributing

- Follow the existing folder structure  
- Use **TypeScript** for type safety  
- Add proper error handling  
- Test before committing  

---

🎉 **Your frontend is now ready to connect with the backend!**
