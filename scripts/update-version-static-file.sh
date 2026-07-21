#!/usr/bin/env bash

set -eu

GITHUB_COM=github.com
BLOCKCERTS_GITHUB_REPO=blockchain-certificates/cvjs-docker
GIT_REPO=$GITHUB_COM/$BLOCKCERTS_GITHUB_REPO.git
WORK_BRANCH=chore/update-version
GITHUB_USER=botcerts
GITHUB_EMAIL=botcerts@users.noreply.github.com

: "${BOTCERTS_PR_GITHUB_TOKEN:?BOTCERTS_PR_GITHUB_TOKEN is required}"

git config user.name "$GITHUB_USER"
git config user.email "$GITHUB_EMAIL"

echo "Creating a new pull request from $WORK_BRANCH to main"
git checkout -b $WORK_BRANCH
git status
git add .version

if git diff --cached --quiet; then
  echo "No version update to commit"
  exit 0
fi

git commit -m "chore(Version): bump version file"

git remote rm origin
git remote add origin https://$GITHUB_USER:$BOTCERTS_PR_GITHUB_TOKEN@$GIT_REPO
git push origin $WORK_BRANCH

curl --fail-with-body -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${BOTCERTS_PR_GITHUB_TOKEN}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$BLOCKCERTS_GITHUB_REPO/pulls \
  -d '{"head":"'$WORK_BRANCH'", "base":"main", "title": "bump version file", "body": "Please review and merge @lemoustachiste"}'
