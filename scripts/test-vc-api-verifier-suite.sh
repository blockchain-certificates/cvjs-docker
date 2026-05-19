#!/usr/bin/env sh
set -eu

: "${VC_API_VERIFIER_TEST_SUITE_REPO:?VC_API_VERIFIER_TEST_SUITE_REPO is required}"
: "${VC_API_VERIFIER_TEST_SUITE_REF:?VC_API_VERIFIER_TEST_SUITE_REF is required}"
workdir="$(mktemp -d)"

cleanup() {
  rm -rf "$workdir"
}
trap cleanup EXIT INT TERM

suite_dir="$workdir/vc-api-verifier-test-suite"

git clone --depth 1 --branch "$VC_API_VERIFIER_TEST_SUITE_REF" "$VC_API_VERIFIER_TEST_SUITE_REPO" "$suite_dir"
cd "$suite_dir"

npm install
npm run test
