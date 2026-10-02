#!/usr/bin/env node
// Runs as the changesets action's `publish` command (see release.yml).
//
// The action execs the publish command directly, without a shell, so shell
// operators are not available here: `npx changeset tag && git push origin
// --tags` is handed to npx as arguments and changeset rejects `--tags`. And
// `changeset tag` only creates tags in the runner's local clone, so without an
// explicit push the Release job "succeeds" while no tag ever reaches the
// remote. This script runs the tag step, pushes the tags, and creates the
// GitHub release for the new tag: the action's own `createGithubReleases`
// stays silent because `changeset tag` reports no published packages.

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

execSync('npx changeset tag', { stdio: 'inherit' });
execSync('git push origin --tags', { stdio: 'inherit' });

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const tag = `v${version}`;
try {
  execSync(`gh release create "${tag}" --title "${tag}" --generate-notes`, { stdio: 'inherit' });
} catch (error) {
  // A release for this tag may already exist (for example on a re-run of the
  // job); that is not a failure of the publish step.
  console.warn(`[release-publish] gh release create "${tag}" did not succeed: ${error.message}`);
}
