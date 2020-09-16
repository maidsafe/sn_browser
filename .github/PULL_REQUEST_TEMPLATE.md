<!--
#### Thank you for contributing!

Please reference the issue(s) which this pull request addresses using [keywords](https://help.github.com/articles/closing-issues-using-keywords/) such as:

```
Resolves #452
Fixes #363
Closes #408
```

---

Provide QA team and reviewer steps to test the resolution.
For example:

```
QA:
Easiest way to test this PR would be to:
- Run API playground
- Initialise app
- Copy the value from [authReqWithoutMockBit](https://github.com/maidsafe/sn_browser/compare/master...hunterlester:454?expand=1#diff-a003f29f7e2f9aeecfe6e3fbb39e3d2eR30)
- Paste value into `authorise` operation and run
- Expect to see an error notification
- Same steps for [encodedNonExistentShareMDataReq](https://github.com/maidsafe/sn_browser/compare/master...hunterlester:454?expand=1#diff-a003f29f7e2f9aeecfe6e3fbb39e3d2eR28)

To QA with external app:
- You could use my repo and [set `forceUseMock` to `false` here](https://github.com/hunterlester/safe-app-base/blob/master/renderer.js#L58), in order to get a `-208` error.
- To test for error `-103`, uncomment [this block](https://github.com/hunterlester/safe-app-base/blob/master/renderer.js#L60-L68), then replace [authUri here](https://github.com/hunterlester/safe-app-base/blob/master/renderer.js#L69), with the `shareMDataReqUri` variable.
```

---

Commit messages should conform to the format:

```
<type>(<scope>): <description>

[optional body]

```

For example:

```
fix(auth): proper values returned on auth_decode_ipc_msg errors

  - Test case for authenticator error -208 IncompatibleMockStatus
  - Test case for authenticator error -103 when decoding share MData
    request for non-existent MData

```

Commit `type` can be one of:  
**feat**: New feature  
**fix**: Bug fix  
**docs**: Documentation only changes  
**style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)  
**refactor**: A code change that neither fixes a bug nor adds a feature  
**perf**: A code change that improves performance  
**test**: Adding missing tests  
**chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation  
**revert**: Reverting a feature, fix, or commit which introduces a regression or new bug

Commit `scope` is open to any succinct term which indicates the effected feature or component.

See [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)

---
Write your description below this line: -->
