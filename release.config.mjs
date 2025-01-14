export default {
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/github',
        [
            "@semantic-release/exec",
            {
                "verifyReleaseCmd": "sh ./scripts/write-version-file.sh ${nextRelease.version}"
            }
        ]
    ],
    branches: ['main', 'chore/versioned-release']
}
