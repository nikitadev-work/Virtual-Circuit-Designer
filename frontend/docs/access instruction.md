## Launch and Access Instructions

### To launch the MVP, open the deployed app at:
- web-site(http://85.198.81.168/)
- You can use any data to get access in registration page 
(!Important: firstly, you must push to 'Sign up', write all information to fields and after that rewrite it in sign form!)

---

### If you wish to run the project locally:

1. **Clone the repository:**
    ```bash
    git clone https://gitlab.pg.innopolis.university/team-45/visual-circuit-designer.git
    ```
2. **Navigate to the project directory:**
    ```bash
    cd project
    ```
3. **Install dependencies:**  
   Ensure you have [Node.js](https://nodejs.org/) (v18+) and [npm](https://www.npmjs.com/) installed.
    ```bash
    npm install
    ```
4. **Create a `.env` file** (if required):  
   Copy the example file and edit environment variables as needed.
    ```bash
    cp .env.example .env
    ```
   Edit the `.env` file to set API endpoints, database URLs, etc.

5. **Start the app:**
    ```bash
    npm run dev
    ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

---

### Troubleshooting

- If you see errors on startup, ensure all environment variables are set correctly in the `.env` file.
- If port 3000 is busy, set a different port in your `.env` file (e.g., `PORT=4000`).
- Make sure you have network access to all required backend services.

---

