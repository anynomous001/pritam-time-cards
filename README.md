# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5622067a-440b-4395-8ed2-0e6518e800f6

## How can I edit this code?

There are several ways of editing your application.

## Known Dependency Issues and Resolutions

### date-fns and react-day-picker Compatibility

This project uses `react-day-picker@8.10.1` which requires `date-fns@^2.28.0 || ^3.0.0`. The project has been configured to use `date-fns@^3.6.0` to ensure compatibility.

If you encounter the following error when running `npm install`:
```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error While resolving: react-day-picker@8.10.1
npm error Found: date-fns@4.x.x
```

This indicates a version conflict between date-fns and react-day-picker. To resolve this issue:

1. Ensure that the package.json file specifies `"date-fns": "^3.6.0"` (not version 4.x)
2. Delete the node_modules directory and package-lock.json file
3. Run `npm install` again

Alternatively, you can use one of these approaches:
- Install with the `--legacy-peer-deps` flag: `npm install --legacy-peer-deps`
- Update to a newer version of react-day-picker that supports date-fns v4 (if available)

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5622067a-440b-4395-8ed2-0e6518e800f6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5622067a-440b-4395-8ed2-0e6518e800f6) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
