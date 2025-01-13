#!/usr/bin/env bash

BLOCKCERTS_GITHUB_REPO=blockchain-certificates/cvjs-docker
GITHUB_USER=botcerts

git checkout -b $WORK_BRANCH
git add .version
git commit -m "chore(Version): bump version file"
git push origin $WORK_BRANCH

curl -vL \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $BOTCERTS_PR_GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$BLOCKCERTS_GITHUB_REPO/pulls \
  -d '{"head":"'${WORK_BRANCH}'", "base":"main", "title": "bump version file", "body": "Please review and merge @lemoustachiste"}'
