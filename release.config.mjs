export default {
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/github',
        [
            "@semantic-release/exec",
            {
                "verifyReleaseCmd": "echo ${nextRelease.version} >> .version"
            }
        ]
    ],
    branches: ['main', 'chore/versioned-release']
}
