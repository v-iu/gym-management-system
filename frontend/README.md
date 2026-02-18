# Gym Management System

A full-stack gym management application built with **React + Vite** (frontend) and **PHP MVC** (backend), using **MySQL** via **XAMPP**.

---

## Prerequisites

- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL)
- [Node.js](https://nodejs.org/) (v18+)

---

## Getting Started

### 1. Start XAMPP

### 2. Import the database

### 3. Install frontend dependencies & run
```bash
cd frontend
npm install
npm run dev
```
App runs at: http://localhost:5173/

### 5. Build for production
```bash
cd frontend
npm run build
```
Output goes to `frontend/dist/`.


# How the Stack Works — Backend ↔ Frontend Reference

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  FRONTEND (React + Vite)        http://localhost:5173               │
│                                                                     │
│  SampleListPage.jsx                                                 │
│    ↓ calls api.get("SampleCrud/index")                              │
│    ↓                                                                │
│  api.js                                                             │
│    ↓ fetch("/api/SampleCrud/index")                                 │
│    ↓                                                                │
│  Vite Dev Proxy (vite.config.js)                                    │
│    ↓ rewrites /api/X → index.php?url=X                              │
└────↓────────────────────────────────────────────────────────────────┘
     ↓
┌────↓────────────────────────────────────────────────────────────────┐
│  BACKEND (PHP MVC)              http://localhost (Apache/XAMPP)      │
│                                                                     │
│  public/index.php  ← entry point, sets CORS headers                 │
│    ↓ requires backend/init.php (loads config, core, functions)       │
│    ↓ creates new App()                                               │
│                                                                     │
│  core/App.php  ← URL router                                         │
│    ↓ parses $_GET['url'] → "SampleCrud/index"                        │
│    ↓ controller = "SampleCrud", method = "index"                     │
│    ↓ loads controllers/SampleCrud.php                                │
│    ↓ calls SampleCrud->index()                                       │
│                                                                     │
│  controllers/SampleCrud.php  ← handles request                      │
│    ↓ $this->model('SampleItem') loads models/SampleItem.php          │
│    ↓ reads $_POST or php://input                                     │
│    ↓ validates, calls model methods                                  │
│    ↓ $this->json(['success' => true, 'data' => ...])                 │
│                                                                     │
│  models/SampleItem.php  ← talks to MySQL                            │
│    ↓ uses Database.php (PDO wrapper)                                 │
│    ↓ $this->db->query() → bind() → execute()/resultSet()/single()    │
│                                                                     │
│  core/Database.php  ← PDO wrapper                                    │
│    ↓ connects to MySQL using config/config.php constants              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Request Lifecycle (step by step)

### 1. Frontend makes a request
```js
// In a React component:
import { api } from "../api";

// GET all items
const res = await api.get("SampleCrud/index");
// res = { success: true, data: [...] }

// POST create
const res = await api.post("SampleCrud/create", {
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone: "123456789"
});

// PUT update
const res = await api.put("SampleCrud/update/5", { first_name: "Jane", ... });

// DELETE
const res = await api.delete("SampleCrud/destroy/5");
```

### 2. api.js sends the fetch request
```js
// api.js converts object → URLSearchParams for POST/PUT bodies
// Content-Type: application/x-www-form-urlencoded
// The URL becomes: /api/SampleCrud/index
```

### 3. Vite proxy rewrites the URL
```js
// vite.config.js must have a proxy for /api:
server: {
  proxy: {
    '/api': {
      target: 'http://localhost',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/gym-management-system/public/index.php?url=') 
        // + whatever comes after /api/
    }
  }
}
// So /api/SampleCrud/index → http://localhost/gym-management-system/public/index.php?url=SampleCrud/index
```

> **IMPORTANT:** For the proxy rewrite to work properly with the `url` query param,
> the actual rewrite logic needs to extract the path after `/api/` and set it as `?url=`.
> See the Vite config proxy section below for the exact setup.

### 4. PHP entry point (public/index.php)
```php
// Sets CORS headers (for cross-origin requests from localhost:5173)
// Requires backend/init.php (autoloads config, core classes)
// Creates new App() which triggers the router
```

### 5. App.php routes the request
```php
// Parses $_GET['url'] → "SampleCrud/index"
// Splits by "/" → ["SampleCrud", "index"]
// Loads controllers/SampleCrud.php
// Calls SampleCrud->index() with remaining URL segments as params
```

### 6. Controller handles business logic
```php
// Checks request method ($_SERVER['REQUEST_METHOD'])
// For POST: reads $_POST (auto-populated by PHP)
// For PUT:  reads php://input and parses manually
// Validates data, calls model methods
// Returns JSON via $this->json()
```

### 7. Model talks to the database
```php
// Uses the Database class (PDO wrapper)
$this->db->query("SELECT * FROM guest WHERE id = :id");
$this->db->bind(':id', $id);
$row = $this->db->single();  // returns one object
// or
$rows = $this->db->resultSet();  // returns array of objects
```

---

## Key Files

| File | Purpose |
|------|---------|
| `public/index.php` | Entry point. CORS headers. Boots the app. |
| `backend/init.php` | Autoloader — requires config, core, functions. |
| `backend/config/config.php` | DB credentials, URL constants. |
| `backend/core/App.php` | URL router — maps URL to controller/method/params. |
| `backend/core/Controller.php` | Base controller — `model()`, `json()`, `error()`. |
| `backend/core/Database.php` | PDO wrapper — `query()`, `bind()`, `execute()`, `resultSet()`, `single()`. |
| `backend/controllers/*.php` | Controller classes — handle requests, validate, return JSON. |
| `backend/models/*.php` | Model classes — DB queries. |
| `frontend/src/api.js` | Fetch wrapper — `api.get()`, `.post()`, `.put()`, `.delete()`. |
| `frontend/src/pages/*.jsx` | React pages/components. |
| `frontend/vite.config.js` | Vite config — dev proxy to PHP backend. |

---

## URL Mapping Cheatsheet

| Frontend Call | HTTP | PHP Controller Method | URL Param |
|---|---|---|---|
| `api.get("SampleCrud/index")` | GET | `SampleCrud->index()` | `?url=SampleCrud/index` |
| `api.get("SampleCrud/show/5")` | GET | `SampleCrud->show(5)` | `?url=SampleCrud/show/5` |
| `api.post("SampleCrud/create", {...})` | POST | `SampleCrud->create()` | `?url=SampleCrud/create` |
| `api.put("SampleCrud/update/5", {...})` | PUT | `SampleCrud->update(5)` | `?url=SampleCrud/update/5` |
| `api.delete("SampleCrud/destroy/5")` | DELETE | `SampleCrud->destroy(5)` | `?url=SampleCrud/destroy/5` |

---

## How POST/PUT Data is Sent

The frontend's `api.js` converts objects to `URLSearchParams` (form-encoded):

```js
// This:
api.post("SampleCrud/create", { first_name: "John", last_name: "Doe" })

// Sends this HTTP body:
// Content-Type: application/x-www-form-urlencoded
// first_name=John&last_name=Doe
```

**On the PHP side:**
- **POST** requests: PHP auto-populates `$_POST` → just read `$_POST['first_name']`
- **PUT** requests: PHP does NOT auto-populate `$_POST` → must manually parse:
  ```php
  parse_str(file_get_contents('php://input'), $putData);
  $putData['first_name']; // "John"
  ```

---

## JSON Response Format

All backend responses follow this shape:

```json
// Success
{ "success": true, "data": [...] }
{ "success": true, "message": "Item created successfully" }

// Validation error (422)
{ "success": false, "errors": { "email": "Email already exists" } }

// General error (400/404/405/500)
{ "success": false, "error": "Something went wrong" }
```

---

## Vite Proxy Config (for dev)

Add this to `vite.config.js` so the frontend can reach the PHP backend:

```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => `/gym-management-system/index.php?url=${path.replace(/^\/api\//, '')}`
      }
    }
  },
});
```

---

## Frontend OOP Architecture

The sample CRUD uses this structure:

```
frontend/src/
├── services/
│   └── CrudService.js           ← OOP service class (reusable base)
├── components/sample/
│   ├── SampleForm.jsx           ← stateless form component
│   ├── SampleTable.jsx          ← stateless table component
│   └── MessageBanner.jsx        ← auto-hiding feedback banner
├── pages/
│   ├── SampleLayout.jsx         ← layout wrapper (renders <Outlet />)
│   └── sample/
│       ├── SampleListPage.jsx   ← list + create/edit logic
│       └── SampleDetailPage.jsx ← single-item view
└── router/
    └── AppRoutes.jsx            ← React Router route definitions
```

### CrudService (OOP Pattern)

Instead of calling `api.get/post/put/delete` directly in components, use a service class:

```js
import { CrudService } from "../services/CrudService";

// Pre-built instance
const service = new CrudService("SampleCrud");

// Usage in a component:
const items = await service.getAll();         // GET /api/SampleCrud/index
const item  = await service.getById(5);       // GET /api/SampleCrud/show/5
await service.create({ name: "John" });       // POST /api/SampleCrud/create
await service.update(5, { name: "Jane" });    // PUT /api/SampleCrud/update/5
await service.destroy(5);                     // DELETE /api/SampleCrud/destroy/5

// Extend for custom resources:
class MemberService extends CrudService {
  constructor() { super("Members"); }
  async register(data) { return this.create(data, "register"); }
}
```

### Component Separation

Components are **stateless** — they receive data via props and call parent callbacks:
- `SampleForm` — renders inputs, calls `onSubmit` / `onChange` / `onCancel`
- `SampleTable` — renders rows, calls `onEdit` / `onDelete`
- `MessageBanner` — shows/hides feedback messages with auto-timeout

All state and business logic lives in the **page** (`SampleListPage`).

---

## React Router Setup

### 1. Install react-router-dom
```bash
cd frontend && npm install react-router-dom
```

### 2. Wrap App with BrowserRouter (main.jsx)
```jsx
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### 3. Replace manual switch/case with Routes (App.jsx)
```jsx
import AppRoutes from "./router/AppRoutes";
// Remove: import { useState } and the renderPage switch

function App() {
  return (
    <div className="min-h-screen ...">
      <Navbar />           {/* Update to use <Link to="/path"> instead of onClick */}
      <main>
        <AppRoutes />      {/* Replaces renderPage() */}
      </main>
    </div>
  );
}
```

### 4. Update Navbar to use Links
```jsx
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const navItem = (path, label) => {
    const isActive = location.pathname === path
      || location.pathname.startsWith(path + "/");
    return (
      <Link to={path} className="...">
        {label}
        <span className={`... ${isActive ? "w-full" : "w-0"}`} />
      </Link>
    );
  };

  return (
    <nav>
      {navItem("/", "Home")}
      {navItem("/members", "Members")}
      {navItem("/staff", "Staff Login")}
      {navItem("/sample", "Sample CRUD")}
    </nav>
  );
}
```

### Route Map
| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Landing page |
| `/members` | `MembersPage` | Member list |
| `/staff` | `StaffLoginPage` | Staff login |
| `/sample` | `SampleLayout` → `SampleDashboard` | Dashboard |
| `/sample/crud` | `SampleLayout` → `SampleListPage` | CRUD list + form |
| `/sample/crud/:id` | `SampleLayout` → `SampleDetailPage` | Single item view |
| `*` | `NotFoundPage` | 404 catch-all |

### Key React Router APIs
| API | What it does |
|-----|-------------|
| `<BrowserRouter>` | Enables routing for the whole app |
| `<Routes>` / `<Route>` | Defines URL → component mapping |
| `<Outlet />` | Renders the matched child route inside a layout |
| `<Link to="/path">` | Navigate without page reload (replaces `<a>`) |
| `useParams()` | Read URL params (e.g. `:id` → `{ id: "5" }`) |
| `useNavigate()` | Programmatic navigation (`navigate("/sample")`) |
| `useLocation()` | Access current URL path for active-link styling |

---

## Creating a New CRUD Feature (Checklist)

### Backend
1. **Database**: Make sure the table exists in `db.sql`
2. **Model**: Create `backend/models/YourModel.php`
   - class with `private $db` and `new Database()` in constructor
   - Add methods: `getAll()`, `getById()`, `create()`, `update()`, `delete()`
3. **Controller**: Create `backend/controllers/YourController.php`
   - `extends Controller`
   - Load model in constructor: `$this->model('YourModel')`
   - Add methods: `index()`, `show($id)`, `create()`, `update($id)`, `destroy($id)`
   - Check `$_SERVER['REQUEST_METHOD']` in each method
   - Read `$_POST` for POST, `parse_str(file_get_contents('php://input'))` for PUT
   - Return JSON via `$this->json()` or `$this->error()`

### Frontend
4. **Service**: Create `frontend/src/services/YourService.js`
   - Extend `CrudService` or create an instance: `new CrudService("YourController")`
5. **Components**: Create stateless components in `frontend/src/components/your-feature/`
   - Form, Table, etc. — receive props, call parent callbacks
6. **Pages**: Create `frontend/src/pages/your-feature/`
   - List page (state + logic), Detail page (read-only view)
   - Optional: Layout wrapper with `<Outlet />`
7. **Routes**: Add to `router/AppRoutes.jsx`
8. **Nav**: Add `<Link>` to `Navbar.jsx`
