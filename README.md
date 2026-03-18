# CSE SUST — Department Portal

> Official web portal for the **Department of Computer Science & Engineering, Shahjalal University of Science & Technology (SUST)**, Sylhet, Bangladesh.

A premium, full-stack web application built with a modern editorial design language — white-on-light gradients, fluid typography, and GSAP-powered scroll animations.

---

## ✨ Features

### Public Pages
- **Homepage** — Hero banner, department overview, faculty message, alumni network, research areas, society showcase, upcoming events, latest notices, quick links
- **Faculty Directory** — Filterable grid with immersive overlay cards and individual profile pages (sticky sidebar layout)
- **Notices & Events** — Paginated listings with detail views
- **Alumni Directory** — Searchable alumni records
- **Achievements** — Academic and extracurricular milestones
- **Society Page** — Student clubs and organizations
- **Academic Resources** — Programs, degrees awarded, tuition fees, statistics
- **Message from Head** — Dedicated editorial page with sticky portrait sidebar

### Authenticated Features
- **Student / Teacher Registration** with email verification (OTP)
- **User Profiles** — Detailed personal and academic info management
- **Work Assignments** — Assignment tracking and management
- **Finance Dashboard** — Fee tracking and financial records
- **Important Data** — Departmental resources and documents
- **Admin Panel** — Full content management, user approval, role-based access

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [Redux Toolkit](https://redux-toolkit.js.org) | State management |
| [GSAP](https://greensock.com/gsap) | Scroll animations & transitions |
| [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | Form handling & validation |
| [Recharts](https://recharts.org) | Data visualization |
| [React Icons](https://react-icons.github.io/react-icons) | Icon library (Feather) |
| [React Hot Toast](https://react-hot-toast.com) | Notifications |
| Vanilla CSS | Custom design system |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org) + [Express](https://expressjs.com) | REST API server |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Supabase](https://supabase.com) | Database (PostgreSQL), Auth, Storage |
| [Cloudinary](https://cloudinary.com) | Image upload & CDN |
| [Nodemailer](https://nodemailer.com) + [Handlebars](https://handlebarsjs.com) | Email service with HTML templates |
| [Zod](https://zod.dev) | Request validation |
| [Helmet](https://helmetjs.github.io) + [CORS](https://www.npmjs.com/package/cors) | Security |
| [Winston](https://github.com/winstonjs/winston) | Logging |
| [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit) | API rate limiting |

---

## 📁 Project Structure

```
SUST_CSE/
├── backend/
│   └── src/
│       ├── config/          # Environment & Supabase config
│       ├── controllers/     # Route handlers
│       ├── errors/          # Custom error classes
│       ├── middleware/       # Auth, error handling, rate limiting
│       ├── modules/         # Feature modules
│       │   ├── auth/        # Authentication & authorization
│       │   ├── faculty/     # Faculty management
│       │   ├── student/     # Student records
│       │   ├── alumni/      # Alumni directory
│       │   ├── notice/      # Notice board
│       │   ├── event/       # Events management
│       │   ├── achievement/ # Achievements
│       │   ├── finance/     # Financial records
│       │   ├── society/     # Societies & clubs
│       │   ├── admin/       # Admin panel APIs
│       │   ├── user/        # User profiles
│       │   ├── workAssignment/ # Work assignments
│       │   └── importantData/  # Important documents
│       ├── routes/          # API route definitions
│       ├── services/        # Cloudinary & Email services
│       ├── templates/       # Email HTML templates
│       ├── utils/           # Helper utilities
│       └── validators/      # Zod schemas
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── home/        # 13 homepage sections
│       │   ├── common/      # Navbar, Footer, Breadcrumb
│       │   ├── auth/        # Login, Register, Protected routes
│       │   ├── admin/       # Admin panel components
│       │   ├── faculty/     # Faculty-related components
│       │   ├── students/    # Student-related components
│       │   ├── alumni/      # Alumni components
│       │   ├── events/      # Event components
│       │   ├── notices/     # Notice components
│       │   ├── finance/     # Finance components
│       │   └── ...
│       ├── pages/           # 30 page components
│       ├── context/         # Auth context
│       ├── store/           # Redux store & slices
│       ├── hooks/           # Custom hooks (GSAP, etc.)
│       ├── data/            # Static data (faculty, etc.)
│       ├── lib/             # API clients & validators
│       ├── styles/          # CSS design system
│       │   ├── global.css
│       │   ├── variables.css
│       │   ├── home.css
│       │   ├── pages.css
│       │   ├── auth.css
│       │   └── skeuomorphism/ # Component-level styles
│       ├── config/          # Constants & configuration
│       └── types/           # TypeScript type definitions
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** or **yarn**
- A **Supabase** project (with database & auth configured)
- A **Cloudinary** account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/SUST_CSE.git
cd SUST_CSE
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

Start the development server:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## 🎨 Design System

The UI follows a **premium editorial** design language:

- **Typography** — Fluid `clamp()` sizing with `Inter` / system fonts, monospace labels for metadata
- **Colors** — White/light-blue gradient backgrounds with red (`#cc2200`) accent
- **Layout** — CSS Grid-based editorial layouts with sticky sidebars
- **Animations** — GSAP ScrollTrigger for scroll-reveal, parallax sections, and page transitions
- **Components** — Glassmorphic cards, numbered lists, pill tags, editorial section labels

---

## 📜 API Modules

| Module | Endpoints |
|---|---|
| Auth | Register, Login, Email verification, Password reset |
| Faculty | CRUD, Profile pages |
| Students | Directory, Profiles |
| Alumni | Directory, Management |
| Notices | CRUD, Pagination |
| Events | CRUD, Detail views |
| Achievements | Student & department achievements |
| Finance | Fee records, Dashboards |
| Society | Clubs & organizations |
| Admin | User management, Content moderation |
| Work Assignments | Assignment tracking |
| Important Data | Document management |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for the **Department of Computer Science & Engineering, SUST**.

---

<p align="center">
  <strong>Department of Computer Science & Engineering</strong><br>
  Shahjalal University of Science & Technology, Sylhet-3114, Bangladesh
</p>
