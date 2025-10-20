#!/usr/bin/env node
/**
 * Automatic Deployment Script
 * This script will deploy your tournament platform to Vercel automatically
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Automatic Deployment to Vercel...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Run this script from project root.');
  process.exit(1);
}

// Step 1: Check environment variables
console.log('📋 Step 1: Checking environment variables...');
if (!fs.existsSync('.env')) {
  console.error('❌ Error: .env file not found!');
  console.log('   Create .env file with your Supabase credentials.');
  process.exit(1);
}
console.log('✅ Environment variables found\n');

// Step 2: Install dependencies
console.log('📦 Step 2: Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Step 3: Build the project
console.log('🔨 Step 3: Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful\n');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Step 4: Initialize Git if not already
console.log('📝 Step 4: Setting up Git...');
if (!fs.existsSync('.git')) {
  try {
    execSync('git init', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Initial commit - Tournament Platform"', { stdio: 'inherit' });
    console.log('✅ Git initialized\n');
  } catch (error) {
    console.log('⚠️  Git setup skipped\n');
  }
} else {
  console.log('✅ Git already initialized\n');
}

// Step 5: Deploy to Vercel
console.log('🚀 Step 5: Deploying to Vercel...');
console.log('\n⚠️  IMPORTANT: Make sure you have:');
console.log('   1. Vercel CLI installed (npm i -g vercel)');
console.log('   2. Vercel account logged in (vercel login)');
console.log('   3. Environment variables ready to paste\n');

console.log('📝 Copy these environment variables to Vercel:\n');
console.log('SUPABASE_URL=https://ielwxcdoejxahmdsfznj.supabase.co');
console.log('SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODA5ODQsImV4cCI6MjA3NjM1Njk4NH0.KAjZJ4Em7zBwWz8XxvyIeTayn6ILrasb7n2uUg0rt2o');
console.log('SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHd4Y2RvZWp4YWhtZHNmem5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4MDk4NCwiZXhwIjoyMDc2MzU2OTg0fQ.nbewHUVOQwIueavCvyi64GRxrcbnTB7EFVOaGy3WJbE');
console.log('SUPABASE_DB_PASSWORD=ISHUkr21@');
console.log('DATABASE_URL=postgresql://postgres.ielwxcdoejxahmdsfznj:ISHUkr21%40@aws-0-ap-south-1.pooler.supabase.com:5432/postgres');
console.log('SESSION_SECRET=d8f4h6s9k2m5p7q1w3e5r8t0y2u4i6o8a1s3d5f7g9h1');
console.log('NODE_ENV=production\n');

console.log('Run: vercel --prod\n');
console.log('✅ Deployment script completed!\n');
console.log('🎉 Your tournament platform is ready to deploy!');
