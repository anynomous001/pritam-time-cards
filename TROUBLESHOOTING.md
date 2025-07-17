# Troubleshooting Guide for Pritam Time Cards

This guide provides solutions for common development environment issues you might encounter while working with this project.

## Table of Contents

1. [Dependency Conflicts](#dependency-conflicts)
2. [Vite Development Server Issues](#vite-development-server-issues)
3. [Build Errors](#build-errors)
4. [TypeScript Errors](#typescript-errors)

## Dependency Conflicts

### Issue: Incompatible Peer Dependencies

**Symptoms:**
- Error messages containing `ERESOLVE could not resolve` during npm install
- Error messages mentioning peer dependency conflicts

**Solutions:**

1. **Specific Version Resolution:**
   - Identify the conflicting packages (check the error message)
   - Update the package.json file to use compatible versions
   - Delete node_modules and package-lock.json
   - Run `npm install` again

2. **Using npm Flags:**
   - `--legacy-peer-deps`: Ignores peer dependency conflicts (use with caution)
     ```
     npm install --legacy-peer-deps
     ```
   - `--force`: Forces installation despite conflicts (use with caution)
     ```
     npm install --force
     ```

### Issue: date-fns and react-day-picker Compatibility

**Symptoms:**
- Error when installing dependencies related to react-day-picker and date-fns

**Solution:**
- Ensure date-fns is version 3.x (not 4.x) in package.json
- See the README.md for detailed instructions

## Vite Development Server Issues

### Issue: 'vite' is not recognized as a command

**Symptoms:**
- Error message: `'vite' is not recognized as an internal or external command`
- Development server fails to start

**Solutions:**

1. **Check node_modules/.bin directory:**
   - Verify that the vite binary exists in node_modules/.bin
   - If missing, reinstall dependencies

2. **Install vite globally:**
   ```
   npm install -g vite
   ```

3. **Use npx to run vite:**
   ```
   npx vite
   ```

### Issue: Port Already in Use

**Symptoms:**
- Error message: `Port XXXX is already in use`

**Solutions:**
1. Close the application using that port
2. Specify a different port:
   ```
   npm run dev -- --port 3001
   ```

## Build Errors

### Issue: TypeScript Compilation Errors

**Symptoms:**
- Build fails with TypeScript type errors

**Solutions:**
1. Fix the reported type issues
2. Temporarily bypass strict type checking (not recommended for production):
   - Add `"skipLibCheck": true` to tsconfig.json

### Issue: Out of Memory During Build

**Symptoms:**
- Build process crashes with memory-related errors

**Solutions:**
1. Increase Node.js memory limit:
   ```
   node --max-old-space-size=4096 ./node_modules/.bin/vite build
   ```
2. Update the build script in package.json:
   ```json
   "build": "node --max-old-space-size=4096 ./node_modules/.bin/vite build"
   ```

## TypeScript Errors

### Issue: Cannot Find Module

**Symptoms:**
- Error message: `Cannot find module 'X' or its corresponding type declarations`

**Solutions:**
1. Install the missing type definitions:
   ```
   npm install --save-dev @types/X
   ```
2. Create a custom type declaration file:
   - Create a file named `X.d.ts` in your project
   - Add the following content:
     ```typescript
     declare module 'X';
     ```

### Issue: Type Errors with External Libraries

**Symptoms:**
- Type errors related to external libraries

**Solutions:**
1. Check if you're using the correct version of type definitions
2. Update the library and its type definitions
3. Add type assertions where necessary (use with caution)