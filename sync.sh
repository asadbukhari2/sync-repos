#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status
set -o pipefail  # Catch errors in piped commands

echo "=== Starting sync script ==="

# Clean old repo folder if exists
if [ -d "temp-repo" ]; then
  echo "Cleaning up existing temp-repo folder..."
  rm -rf temp-repo
fi

echo "Cloning Bitbucket repo (branch: main)..."
git clone --branch main "$BITBUCKET_REPO" temp-repo

cd temp-repo

echo "Configuring Git settings for this repo..."
git config http.postBuffer 524288000
git config core.compression 9

echo "Removing '.next' folder if it exists..."
rm -rf .next || echo ".next folder not found, continuing..."

echo "Adding GitHub remote..."
git remote add github "$GITHUB_REPO"

echo "Pushing changes to GitHub 'dev' branch..."
git push github main:dev --force

cd ..

echo "Cleaning up temp-repo folder after successful push..."
rm -rf temp-repo

echo "=== Sync script finished successfully ==="


