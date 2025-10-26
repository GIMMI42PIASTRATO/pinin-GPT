# Contribute
1. Fork the repository, clone it, and create a new branch
   
	```bash
	git clone https://github.com/<your-name>/pinin-GPT.git
	cd pinin-GPT
	git checkout -b development
	```
	From now on, we’ll assume you are inside the project folder.
3. Install the dependencies
   
	> ⚠️ HOLD UP!
	>This project uses pnpm as the package manager.
	>If you don’t have it installed, run:
	>```bash
	>npm install -g pnpm
	>```
	Now you can install the dependencies:
	```bash
	pnpm install
	```
5. Install MySQL server, start it, and create a new database
   
	>❗ Don’t use MariaDB!
	>This project requires MySQL — MariaDB will not work.
	>You can download MySQL from [here](https://dev.mysql.com/downloads/mysql/)
	```bash
	mysqld &
	mysql -u root -p
	>>> CREATE DATABASE pinin-GPT;
	```
7. Apply the migrations to the database
   
   ```bash
	pnpm exec drizzle-kit migrate
   ```
9. Install ollama and pull a model
    
   You can install ollama from [here](https://ollama.com/download)
   ```bash
   ollama &
   # Install a model - any model will work
   ollama pull gemma3:1b
   ```
11. Create a `.env` file for secrets and environment variables
    
	There is a `.env.example` file you can use as a reference.
	```.env
 	# Clerk variable
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
	CLERK_SECRET_KEY=
	NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
	NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/chat
	NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/chat
	
	# DB
	# DB URL schema: mysql://<user>:<password>@<host>:<port>/<database>
	DATABASE_URL=mysql://root@localhost:3306/pinin-GPT
	
	# Allow anonymous chats (set to "<something-here>" to enable anonymous chats without login else leave an empty string)
	NEXT_PUBLIC_ALLOW_ANONYMOUS_CHATS="true"
 	```
 	You will need your Clerk public and secret keys.
	To obtain them, create an account on the [Clerk website](https://clerk.com/) and set up a new project — their setup guide is straightforward.
13. Start the web app
    
    To run the app in development mode:
	```bash
	pnpm run dev
	```
	To test the production build:
	```bash
	pnpm run build
 	pnpm run start
	```
    Once the app is running, open your browser and go to:
    ```bash
    http://localhost:3000
    ```
