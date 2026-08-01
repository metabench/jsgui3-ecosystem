# Release And Remote Policy

Agents may help prepare commits and push to remotes when release/remote management is in scope.

## Before Commit

1. Run `git status` in the owning repo.
2. Inspect the diff.
3. Confirm no unrelated user changes are included.
4. Run the smallest relevant validation first.
5. Run broader tests when the change touches public API, release files, or shared behavior.

## Before Push

1. Run `git branch --show-current`.
2. Run `git remote -v`.
3. Confirm the intended branch and remote.
4. Confirm validation passed.
5. Use a clear commit message.

## Rules

- Push is ordinary for validated release/remote work when the user has put that work in scope.
- Do not force push unless explicitly requested.
- Do not push failing work unless explicitly requested for a diagnostic branch.
- Split cross-repo work into coherent commits per repo.
- If any check fails, stop the push path and record the blocker.
