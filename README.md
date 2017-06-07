# component-library

[![NSP Status](https://nodesecurity.io/orgs/nyx/projects/daca1adf-9fc6-42fa-9186-5fb81d5cf9c6/badge)](https://nodesecurity.io/orgs/nyx/projects/daca1adf-9fc6-42fa-9186-5fb81d5cf9c6)

## Design Principles
Simple is better than complex.
Explicit is better than implicit.
Readability counts.
Flat is better than nested.
Sparse is better than dense.
Special cases aren't special enough to break the rules.
Follow SemVer religiously.
Maintain sandboxes for components.
Ship it.

## How do I get started?
1. Run `yarn` at the root.
2. Navigate to the directory of the component you're interested in.
3. Run `yarn` in that directory.

# Development

To develop a component `FOO`, all you need is these commands:

### `yarn sandbox`

Spins up `FOO` and serves it up on `http://localhost:8080` (or `http://ude.8080`) for you to play around with in a standalone environment. The sandbox files are usually minimal implementation examples for the component, so keep them up to date!

### `yarn dev`

Builds the dev bundle and watches the folder, rebuilding on a change.

In the tool which is importing `FOO`, use `yarn link FOO` to take advantage of these hot builds.

# Publishing
Make sure the sandbox works.

Please update the README for each component with each change.

`npm version PATCH|MINOR|MAJOR` in the component itself:

- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backwards-compatible manner
- PATCH version when you make backwards-compatible bug fixes.

**SEMVER IS CRUCIAL.** For questions, start at [semver.org](http://semver.org/).

If you have publishing rights, run `npm publish`.  

If not, find and go ask the maintainers of the component for code review to ensure quality and continuity.
Or, make a new component and try to consolidate at a later time.
