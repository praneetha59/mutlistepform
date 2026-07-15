# Premium Multi-Step Registration Form | Lorem Gaming

Welcome to the **Lorem Gaming Multi-Step Subscription Registration Wizard**! This application is a fully responsive, type-safe, highly accessible frontend app built using **React**, **TypeScript**, **React Router v6**, and **Vanilla CSS**. It is integrated with a local **Express.js Mock API backend** and fully orchestratable using **Docker Compose**.

---

## 🛠️ Architectural & Design Decisions

### 1. Technology Stack
- **Frontend Core**: React 19, TypeScript 6, Vite 8 (extremely fast build tool with instant HMR).
- **Client-Side Routing**: `react-router-dom` v6 setup with:
  - Top-level routes: `/` (Landing Home Page) and `/form` (Wizard Layout).
  - Nested step paths: `/form/step1`, `/form/step2`, `/form/step3`, `/form/step4`, and `/form/success`.
  - Route Guarding: A wrapper checks completion status. Skipping steps is prevented; direct navigation attempts automatically redirect users to the first incomplete step.
  - Invalid path handling: Redirects all non-existent paths to a dedicated `/404 Page Not Found` view.
- **State Management**: React Context (`FormContext`) that manages all inputs, validations, active routes, and theme states. Form inputs are synced to `localStorage` in real-time, allowing users to refresh pages without losing progress. Stored state is cleaned up upon final submission.
- **Styling System**: Centralized Vanilla CSS with a customized HSL color palette. Theme toggles support a dark mode and a light mode, persisting settings in local storage and matching OS preferences.
- **Mock API Service**: Express.js REST server running on port 5000. Serves actual POST routes `/api/check-email` (uniqueness check), `/api/check-promo` (validates discount codes), and `/api/submit-form` (submits payload).

### 2. Form Features & Conditional Rendering
- **Step 1 (Personal Info)**:
  - Synchronous validation on name length ($\ge 3$), email syntax, phone format, and date of birth (user must be $\ge 18$ years old).
  - **Conditional Rendering**: Adds "Are you employed?" radio selections. If "Yes" is checked, a required text field "Company Name" renders dynamically (requires $\ge 2$ characters).
  - Asynchronous validation query to mock server checking if the email is taken (blocks `taken@example.com` and `test@test.com`).
- **Step 2 (Plan Selection)**: Arcade ($9/mo), Advanced ($12/mo), or Pro ($15/mo) tiers. Toggles billing frequency (Monthly vs Yearly). Yearly billing displays a "2 months free" promo label.
- **Step 3 (Add-ons)**: Toggle Online play, Larger cloud storage, and Customizable profile headers.
- **Step 4 (Summary & Promo Code)**: Review choices. Enter promo codes `SAVE10` (10% off) or `SAVE20` (20% off) verified asynchronously against the REST API.
- **Step 5 (Confirmation)**: Animated thank-you page that resets form state on mount.

### 3. Accessibility Standards (WCAG Compliance)
- **Focus Management**: Shifting focus automatically to the `<h1>` of the step page on mount via a custom `useFocusOnMount` hook.
- **Semantic HTML**: Proper elements (fieldset, legends, buttons, headings, sections).
- **ARIA Attributes**: `aria-invalid`, `aria-describedby` (binding fields to error text), `aria-required`, and `aria-live="polite"` zone for toast announcements.
- **Keyboard Navigation**: Active select cards styled using hidden standard radios/checkboxes. Fully tab-focusable, respects arrow keys, and supports space/enter selections natively. Focus visible ring using double outlines via `:focus-visible`.

---

## 🚀 Running the Project

### Method A: Docker Compose (Recommended)
This orchestrates both the frontend server and backend API server containers.

1. **Pre-requisites**: Ensure you have [Docker](https://www.docker.com/) installed and running.
2. **Build and Run**: Run the following command in the root of the project:
   ```bash
   docker-compose up --build
   ```
3. **Accessing the App**:
   - **Frontend App**: Open [http://localhost:5173](http://localhost:5173) in your browser.
   - **Mock API server**: Port [http://localhost:5000](http://localhost:5000).

---

### Method B: Native Local Running
Run the services natively on your host machine.

#### 1. Setup Backend API Server
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start Express server (runs on port 5000)
npm start
```

#### 2. Setup Frontend React App
Open a new terminal window:
```bash
# In the root directory, install dependencies
npm install

# Start Vite dev server (runs on port 5173 and proxies /api to port 5000)
npm start
```
Open [http://localhost:5173](http://localhost:5173) to view the application.

---

## 🧪 Testing

We have built a comprehensive unit and integration test suite in `src/test/MultiStepForm.test.tsx` using **Vitest** and **React Testing Library** to verify validation rules, conditional rendering, theme states, and REST API triggers.

To run the tests:
```bash
# Run tests in watch mode
npx vitest

# Run tests once and exit
npx vitest run
```

### Test Case Coverage
- **Personal Details Error Checks**: Asserts errors trigger on empty submissions.
- **Conditional Rendering Validation**: Asserts "Company Name" is hidden by default, renders on "Yes" employment choice, and checks sync validations for the input box.
- **Age Restriction Check**: Asserts validation error if the user is under 18 years old.
- **Mocked Fetch Email Uniqueness Check**: Asserts the async validation state blocks `taken@example.com`.
- **Plan Tier Toggles**: Asserts plan selection cards and monthly/yearly toggles behave correctly.
- **Mocked Fetch Promo Validation**: Asserts async promo validations succeed for `SAVE10` and fail on invalid codes.
