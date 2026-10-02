#!/usr/bin/env node
// Runs as the changesets action's `publish` command (see release.yml).
//
// The action execs the publish command directly, without a shell, so shell
// operators are not available here: `npx changeset tag && git push origin
// --tags` is handed to npx as arguments and changeset rejects `--tags`. And
// `changeset tag` only creates tags in the runner's local clone, so without an
// explicit push the Release job "succeeds" while no tag ever reaches the
// remote. This script runs the tag step and then pushes the tags, which is what
// actually publishes the release.

import { execSync } from 'node:child_process';

execSync('npx changeset tag', { stdio: 'inherit' });
execSync('git push origin --tags', { stdio: 'inherit' });
