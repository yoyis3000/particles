# component-library

[![NSP Status](https://nodesecurity.io/orgs/nyx/projects/daca1adf-9fc6-42fa-9186-5fb81d5cf9c6/badge)](https://nodesecurity.io/orgs/nyx/projects/daca1adf-9fc6-42fa-9186-5fb81d5cf9c6)

## Two Design Principles. No Exceptions.
- **Aggressively remove complexity whenever possible**
  - Keep the folder structure flat
  - Slice out dependencies with fire
  - Make it easy for the next person
  - Make things *fast* to work with
- **Isolate changes**
  - Follow SemVer religiously
  - Maintain sandboxes for components

## What problems does this solve?

- **Prevents accidental global changes**
  - Versions won't be bumped until the dev is ready
  - App-wide changes can be made incrementally in small, controllable, testable bumps
- **Prevents reliance on a single framework**
  - Components can be written in any flavor of Javascript
  - Framework updates are neatly contained and not blockers
- **Solves difficulty diagnosing performance in a monolith**
  - Isolated components can be tested easily
  - Isolated components aggressively expose dependencies
- **Solves dragging the entire application around on each page**
  - Tool-based architectures avoid bringing the jungle when you want the gorilla
  - No need for splitting strategies (overly complex and poorly understood!)
- **Dramatically speeds up build pipeline - and development time**
  - Developing individual components in a sandbox means sub-second build times
  - Tools import only the components they need
- **Accelerates onboarding, maintenance, and deploy**
  - Simpler code allows engineers to grok faster
  - Isolated components encourage composition
  - Isolated components make bug fixes easier to diagnose and address
  - Tool-based architectures allow tool-based deployes

`Wait, that's awesome` - Most people

## How do I get started?
If you already have `yarn`, run `yarn` at the root, otherwise run `npm install` at the root of this repo.  

This will install:
- [yarn](https://yarnpkg.com/en/)
- [lerna](https://lernajs.io/)
- Code style preferences for Javascript and CSS

Then, run `lerna boostrap` at the root. It will install all dependencies for all components.

# Development

To develop a component `FOO`, all you need is these commands:

### yarn sandbox

Spins up `FOO` and serves it up on `http://localhost:8080` (or `http://ude.8080`) for you to play around with in a standalone environment. The sandbox files are usually minimal implementation examples for the component, so keep them up to date!

### yarn dev

Builds the dev bundle and watches the folder, rebuilding on a change.

In the tool which is importing `FOO`, use `yarn link FOO` to take advantage of these hot builds.


# Publishing

`lerna publish` at the root is your friend. It will ask you what kind of version bump a change might be:

- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backwards-compatible manner
- PATCH version when you make backwards-compatible bug fixes.

**SEMVER IS CRUCIAL.** For questions, start at [semver.org](http://semver.org/).

If you have publishing rights to a component, this will go along smoothly. If not, find and go ask the maintainers of the component for code review to ensure quality and continuity.
