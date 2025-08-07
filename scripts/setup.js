#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Cartterr Portfolio...\n');

function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`📦 Running: ${command}`);
    execSync(command, { 
      stdio: 'inherit', 
      cwd,
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    console.log('✅ Success!\n');
  } catch (error) {
    console.error(`❌ Error running command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function createEnvFiles() {
  console.log('📝 Creating environment files...');
  
  // Backend .env
  const backendEnvPath = path.join(process.cwd(), 'backend', '.env');
  if (!fs.existsSync(backendEnvPath)) {
    const backendEnvContent = `NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
`;
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log('✅ Created backend/.env');
  }

  // Frontend .env
  const frontendEnvPath = path.join(process.cwd(), 'frontend', '.env');
  if (!fs.existsSync(frontendEnvPath)) {
    const frontendEnvContent = `VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_CONTACT_FORM=true
`;
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log('✅ Created frontend/.env');
  }
  
  console.log('');
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 18) {
    console.error('❌ Node.js version 18 or higher is required');
    console.error(`Current version: ${nodeVersion}`);
    process.exit(1);
  }
  
  console.log(`✅ Node.js version: ${nodeVersion}\n`);
}

function installDependencies() {
  console.log('📦 Installing dependencies...\n');
  
  // Install root dependencies
  console.log('📦 Installing root dependencies...');
  runCommand('npm install');
  
  // Install frontend dependencies
  console.log('📱 Installing frontend dependencies...');
  const frontendPath = path.join(process.cwd(), 'frontend');
  if (!fs.existsSync(path.join(frontendPath, 'node_modules'))) {
    runCommand('yarn install', frontendPath);
  } else {
    console.log('✅ Frontend dependencies already installed\n');
  }
  
  // Install backend dependencies
  console.log('🔧 Installing backend dependencies...');
  const backendPath = path.join(process.cwd(), 'backend');
  if (!fs.existsSync(path.join(backendPath, 'node_modules'))) {
    runCommand('yarn install', backendPath);
  } else {
    console.log('✅ Backend dependencies already installed\n');
  }
}

function setupComplete() {
  console.log('🎉 Setup complete!\n');
  console.log('📋 Next steps:');
  console.log('  1. npm run dev           - Start development servers');
  console.log('  2. npm run build         - Build for production');
  console.log('  3. npm run docker:dev    - Run with Docker (development)');
  console.log('  4. npm run docker:prod   - Run with Docker (production)');
  console.log('');
  console.log('🌐 URLs:');
  console.log('  Frontend: http://localhost:3000');
  console.log('  Backend:  http://localhost:5000');
  console.log('  API:      http://localhost:5000/api');
  console.log('');
  console.log('📚 Documentation:');
  console.log('  - Check README.md for detailed instructions');
  console.log('  - Environment variables: env.example files');
  console.log('');
}

// Main setup process
async function main() {
  try {
    checkNodeVersion();
    createEnvFiles();
    installDependencies();
    setupComplete();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
