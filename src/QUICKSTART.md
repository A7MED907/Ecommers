# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

---

## 🎯 Key Features to Try

### 1. **Browse Products**
- Products are fetched from real API
- Use category filters in navbar
- Search for products
- Click on any product for details

### 2. **Authentication**
- Click "Register" to create an account
- Use these test credentials or create your own:
  - Email: `test@example.com`
  - Password: `Test123!`

### 3. **Wishlist**
- Login first (required)
- Click heart icon on product cards
- View wishlist count in navbar

### 4. **Shopping Cart**
- Click "Add to Cart" on any product
- Cart icon shows item count
- Click cart to view/manage items
- Adjust quantities or remove items

### 5. **Dark Mode**
- Click sun/moon icon in navbar
- Theme persists across sessions

### 6. **Product Details**
- Click any product card
- View full details, images, ratings
- Add to cart/wishlist
- Adjust quantity before adding

---

## 📱 Test Responsiveness

### Desktop (1024px+)
- Full navigation bar
- 4-column product grid
- All features visible

### Tablet (768px - 1023px)
- 2-3 column grid
- Responsive navbar

### Mobile (<768px)
- Single column
- Mobile menu
- Touch-friendly controls

---

## 🔑 API Endpoints

The app uses: `https://ecommerce.routemisr.com/api/v1`

### Available Features:
- ✅ Products (pagination, search, filter)
- ✅ Categories
- ✅ Brands
- ✅ Authentication (register/login)
- ✅ Wishlist (requires auth)

---

## 🎨 Theme Customization

Edit `/styles/globals.css` to change colors:

```css
:root {
  --primary: #2563eb;        /* Primary color */
  --destructive: #d4183d;    /* Sale/delete color */
  --background: #ffffff;     /* Background */
  /* ... more variables */
}
```

---

## 📂 Project Structure Quick Reference

```
/app/              → Pages (Home, ProductDetails, Login, etc.)
/components/       → Reusable UI components
/context/          → Global state (Auth, Theme, Wishlist)
/services/         → API calls
/types/            → TypeScript definitions
/styles/           → Global CSS
```

---

## 🛠️ Common Tasks

### Add a New Page
1. Create file in `/app/YourPage.tsx`
2. Add route in `/routes.tsx`
3. Import and use in navigation

### Add a New API Endpoint
1. Add function to `/services/api.ts`
2. Define types in `/types/models.ts`
3. Use in component with error handling

### Create a New Component
1. Create folder `/components/ComponentName/`
2. Add `ComponentName.tsx` and `ComponentName.css`
3. Import and use where needed

---

## 🐛 Troubleshooting

### Products Not Loading
- Check internet connection
- API might be temporarily down
- Check browser console for errors

### Login Not Working
- Ensure valid email format
- Password must be 6+ characters
- Check network tab for API errors

### Theme Not Persisting
- Check localStorage is enabled
- Clear browser cache if needed

### Cart Not Updating
- Check console for errors
- Ensure product has stock

---

## 💡 Tips

### For Development
- Use React DevTools to inspect components
- Check Network tab for API calls
- Use localStorage to view stored data

### For Testing
- Try registering a new account
- Add multiple products to cart
- Test all theme combinations
- Try on different screen sizes

### For Learning
- Read component comments
- Check TypeScript types
- Follow data flow in Context providers
- Examine API service structure

---

## 📚 Learn More

### Key Technologies
- **React** - UI framework
- **TypeScript** - Type safety
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Context API** - State management

### Documentation
- `README.md` - Full documentation
- `CHANGES.md` - What was changed
- Component comments - Inline docs

---

## ✅ Checklist for First Run

- [ ] Install dependencies
- [ ] Start dev server
- [ ] Register an account
- [ ] Browse products
- [ ] Add to cart
- [ ] Add to wishlist
- [ ] Toggle dark mode
- [ ] View product details
- [ ] Try search and filters
- [ ] Test on mobile

---

## 🎉 You're Ready!

Everything is set up and ready to use. Explore the code, try the features, and build something amazing!

**Questions?** Check the full README.md for detailed documentation.

**Developer:** [Ahmed Salem](https://ahmed-salem-resume.netlify.app/)
