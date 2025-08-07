#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Cartterr Portfolio...\n');

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

function checkDockerInstallation() {
  try {
    execSync('docker --version', { stdio: 'pipe' });
    execSync('docker-compose --version', { stdio: 'pipe' });
    console.log('✅ Docker and Docker Compose are installed\n');
  } catch (error) {
    console.error('❌ Docker or Docker Compose is not installed');
    console.error('Please install Docker Desktop from https://www.docker.com/products/docker-desktop');
    process.exit(1);
  }
}

function buildApplications() {
  console.log('🔨 Building applications...\n');
  
  // Build frontend
  console.log('📱 Building frontend...');
  const frontendPath = path.join(process.cwd(), 'frontend');
  runCommand('yarn build', frontendPath);
  
  // Build backend
  console.log('🔧 Building backend...');
  const backendPath = path.join(process.cwd(), 'backend');
  runCommand('yarn build', backendPath);
}

function deployWithDocker() {
  console.log('🐳 Deploying with Docker...\n');
  
  // Stop existing containers
  console.log('🛑 Stopping existing containers...');
  try {
    runCommand('docker-compose down');
  } catch (error) {
    console.log('ℹ️ No existing containers to stop\n');
  }
  
  // Build and start containers
  console.log('🏗️ Building and starting containers...');
  runCommand('docker-compose up --build -d');
  
  // Wait a moment for containers to start
  console.log('⏳ Waiting for containers to start...');
  setTimeout(() => {
    checkDeploymentHealth();
  }, 10000);
}

function checkDeploymentHealth() {
  console.log('🔍 Checking deployment health...\n');
  
  try {
    // Check backend health
    execSync('curl -f http://localhost:5000/api/health', { stdio: 'pipe' });
    console.log('✅ Backend is healthy');
    
    // Check frontend
    execSync('curl -f http://localhost:3000', { stdio: 'pipe' });
    console.log('✅ Frontend is accessible');
    
    // Check nginx
    execSync('curl -f http://localhost:80/health', { stdio: 'pipe' });
    console.log('✅ Nginx is healthy');
    
  } catch (error) {
    console.log('⚠️ Some services may still be starting...');
    console.log('Run "npm run docker:logs" to check container logs');
  }
  
  deploymentComplete();
}

function deploymentComplete() {
  console.log('\n🎉 Deployment complete!\n');
  console.log('🌐 Your portfolio is now running at:');
  console.log('  Production:  http://localhost');
  console.log('  Frontend:    http://localhost:3000');
  console.log('  Backend:     http://localhost:5000');
  console.log('  API:         http://localhost:5000/api');
  console.log('');
  console.log('📊 Management commands:');
  console.log('  npm run docker:logs    - View container logs');
  console.log('  npm run docker:stop    - Stop all containers');
  console.log('  docker-compose ps      - Check container status');
  console.log('');
  console.log('🔧 For production deployment:');
  console.log('  1. Update domain in nginx.conf');
  console.log('  2. Add SSL certificates to ./ssl directory');
  console.log('  3. Update environment variables for production');
  console.log('');
}

// Main deployment process
async function main() {
  try {
    checkDockerInstallation();
    buildApplications();
    deployWithDocker();
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

main();
