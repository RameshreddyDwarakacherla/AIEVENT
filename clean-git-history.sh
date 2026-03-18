#!/bin/bash

# WARNING: This will rewrite git history and force push
# Make sure all team members are aware before running this

echo "🚨 CRITICAL SECURITY FIX: Removing sensitive data from git history"
echo "This will rewrite git history and require force push"
echo ""

# Remove sensitive files from git history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch backend/.env.production frontend/.env.production' \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Git history cleaned"
echo "⚠️  You MUST now:"
echo "1. Revoke and regenerate ALL API keys"
echo "2. Change ALL passwords and secrets"
echo "3. Force push: git push --force-with-lease origin main"
echo "4. Notify all team members to re-clone the repository"