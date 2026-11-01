# GIT-WORKFLOW.md

# Enterprise GitHub Engineering Operations Standard

**Classification:** Mandatory engineering policy  
**Applies to:** All developers, coding agents, automation, CI/CD workflows, and repository operations.  
**Operating model:** Enterprise software engineering organization  
**Objective:** Operate GitHub with the engineering discipline, traceability, security, and release controls expected of a large software company.

---

# 1. Engineering Operating Model

GitHub is the central source of truth for all project development.

The repository must operate using professional engineering practices, including:

- Controlled source code management.
- Feature branch development.
- Pull request-based integration.
- Automated code quality enforcement.
- Independent review requirements.
- Continuous integration.
- Continuous delivery.
- Release management.
- Semantic versioning.
- Security scanning.
- Dependency governance.
- Change tracking.
- Incident management.
- Rollback procedures.
- Engineering auditability.

The coding agent must behave like an engineering team member operating inside a professional software organization.

It must not treat GitHub as a location to occasionally upload code.

Every implementation must be traceable from its original requirement through development, testing, review, integration, and release.

# 2. Source of Truth

The following hierarchy defines project authority:

1. GitHub repository: authoritative source code.
2. Git history: authoritative record of code changes.
3. GitHub Issues: authoritative engineering work tracking.
4. Pull Requests: authoritative change review and integration records.
5. GitHub Actions: authoritative automated verification.
6. GitHub Releases: authoritative release records.
7. Project documentation: authoritative technical specifications.

Never treat an uncommitted local change as completed project work.

Never report a GitHub operation as successful without confirming its result.

# 3. Repository Organization

Maintain a professional repository structure.

Required files and directories where applicable:

    .github/
      workflows/
      ISSUE_TEMPLATE/
      PULL_REQUEST_TEMPLATE.md
      CODEOWNERS
      dependabot.yml

    docs/
      architecture/
      decisions/
      engineering/
      releases/
      operations/

    scripts/
    packages/
    apps/

    AGENTS.md
    PRD.md
    ARCHITECTURE.md
    DATABASE.md
    EDITOR-SPEC.md
    DESIGN-SYSTEM.md
    PLUGIN-SYSTEM.md
    GIT-WORKFLOW.md
    CHANGELOG.md
    CONTRIBUTING.md
    SECURITY.md

Do not create empty directories or meaningless documentation simply to satisfy this structure.

# 4. Branch Protection and Repository Governance

The primary branch is `main`.

The repository should use the following branch model:

    main
      └── release branches where necessary

    feature/<issue-number>-<description>
    fix/<issue-number>-<description>
    hotfix/<issue-number>-<description>
    refactor/<description>
    docs/<description>
    chore/<description>
    security/<description>

Rules:

- No routine direct commits to `main`.
- All feature work must use a dedicated branch.
- All production changes must enter `main` through an approved pull request.
- Branches must have clear, descriptive names.
- Shared branch history must never be rewritten casually.
- Force pushes must be prohibited on protected branches.
- Deletion of protected branches must be prohibited.
- Require status checks before merging.
- Require approval according to repository review policy.
- Require conversation resolution before merging.
- Require up-to-date branches before merging where appropriate.

Configure GitHub branch protection or repository rulesets.

The agent must inspect existing repository settings before recommending changes.

Do not claim branch protection exists until its configuration has been verified.

If the agent lacks permission to configure repository settings, document the exact required settings for the repository administrator.

# 5. Engineering Work Management

Every substantial engineering task must have a traceable work item.

Use GitHub Issues for:

- Features.
- Bugs.
- Security vulnerabilities.
- Technical debt.
- Infrastructure changes.
- Performance improvements.
- Architectural changes.
- Documentation work.
- Release preparation.

Issues must contain:

**Feature issue**

- Objective.
- User problem.
- Requirements.
- Acceptance criteria.
- Dependencies.
- Testing expectations.
- Relevant specifications.

**Bug issue**

- Description.
- Reproduction steps.
- Expected behavior.
- Actual behavior.
- Environment.
- Severity.
- Relevant logs where safe.

**Technical debt issue**

- Existing limitation.
- Impact.
- Proposed improvement.
- Risk of not addressing it.

Use labels consistently:

    type:feature
    type:bug
    type:security
    type:refactor
    type:documentation
    type:maintenance

    priority:critical
    priority:high
    priority:medium
    priority:low

    status:triage
    status:in-progress
    status:blocked
    status:ready-for-review

    area:admin
    area:api
    area:cms
    area:editor
    area:database
    area:plugins
    area:infrastructure

Do not create duplicate issues.

Do not close an issue until its acceptance criteria are satisfied.

# 6. Development Lifecycle

Every implementation must follow this lifecycle:

    REQUIREMENT
         ↓
    ISSUE / WORK ITEM
         ↓
    TECHNICAL ANALYSIS
         ↓
    BRANCH CREATION
         ↓
    IMPLEMENTATION
         ↓
    LOCAL VERIFICATION
         ↓
    DIFF REVIEW
         ↓
    COMMIT
         ↓
    PUSH
         ↓
    PULL REQUEST
         ↓
    AUTOMATED CI
         ↓
    INDEPENDENT REVIEW
         ↓
    APPROVAL
         ↓
    MERGE
         ↓
    POST-MERGE VERIFICATION
         ↓
    RELEASE
         ↓
    DEPLOYMENT
         ↓
    MONITORING

Not every documentation change requires a release. The lifecycle must be scaled to the risk and type of change.

# 7. Branch Creation

Before creating a branch:

1. Inspect the current repository state.
2. Identify the current branch.
3. Fetch remote updates.
4. Verify the correct base branch.
5. Check for uncommitted user changes.
6. Check whether the task already has an issue.
7. Create a branch with an appropriate name.

Example:

    git fetch origin
    git switch main
    git pull --ff-only origin main
    git switch -c feature/123-visual-editor-components

Never overwrite unrelated local changes.

Never use `git reset --hard` to clean up a repository without explicit authorization.

Never assume the repository's default branch is named `main` without verification.

# 8. Implementation Standards

During implementation:

- Keep changes focused.
- Follow project architecture.
- Preserve package boundaries.
- Add tests alongside functionality.
- Update documentation when behavior changes.
- Avoid unrelated refactoring.
- Avoid unnecessary dependency additions.
- Maintain backward compatibility unless explicitly changing it.
- Document breaking changes.
- Never introduce placeholder functionality as completed work.

For substantial features, use smaller reviewable commits.

Do not combine unrelated features into one enormous commit.

# 9. Commit Standards

Use Conventional Commits.

Format:

    <type>(<scope>): <description>

Types:

- feat
- fix
- refactor
- perf
- test
- docs
- build
- ci
- chore
- security
- revert

Examples:

    feat(editor): introduce component registry
    fix(content): prevent duplicate publishing jobs
    refactor(database): isolate repository adapters
    perf(renderer): optimize component resolution
    test(plugins): verify capability enforcement
    docs(api): document authentication endpoints

Rules:

- Commit messages must describe the actual change.
- Avoid vague messages.
- Avoid meaningless commit frequency.
- Do not commit secrets.
- Do not commit broken work as a completed implementation.
- Do not bypass Git hooks.

A commit is a record of a logical change, not simply a record of every file modification.

# 10. Automated Code Verification

Before pushing implementation work, run the applicable verification suite.

For this TypeScript monorepo, inspect available package scripts and run the corresponding checks.

Expected checks:

    pnpm install --frozen-lockfile
    pnpm format:check
    pnpm lint
    pnpm typecheck
    pnpm test
    pnpm build

These commands are expected policy targets, not an assumption that every script already exists.

Additional checks should include:

- Unit tests.
- Integration tests.
- End-to-end tests.
- Database migration validation.
- API contract tests.
- Accessibility tests.
- Package boundary checks.
- Security checks.
- Dependency audits.
- Production build verification.

Verification requirements:

- Never hide failed checks.
- Never claim unexecuted tests passed.
- Never bypass required checks to force a successful pipeline.
- Never silently modify tests just to make an implementation pass.
- Investigate failures before proceeding.
- Distinguish pre-existing failures from failures introduced by the current work.

# 11. Git Diff Review

Before staging changes:

    git status --short
    git diff --check
    git diff

Inspect staged changes separately:

    git diff --cached

Review for:

- Accidental changes.
- Unrelated files.
- Debug statements.
- Secrets.
- Hardcoded credentials.
- Temporary files.
- Generated artifacts.
- Broken documentation.
- Unintended dependency changes.
- Unsafe database migrations.
- Breaking API changes.

Stage only intended files.

Never blindly stage the entire repository when unrelated user changes exist.

# 12. Push Operations

The agent is authorized to automatically push verified implementation work to its authorized feature branch.

Before pushing:

1. Verify local tests.
2. Verify the working tree.
3. Review the staged diff.
4. Create the commit.
5. Confirm the branch.
6. Push to the configured remote.

Example:

    git push -u origin feature/123-visual-editor-components

Use the actual configured remote name.

Do not push unverified implementation work as a completed change.

Do not push directly to protected branches.

After pushing, verify the remote branch and commit SHA.

A successful local commit does not mean the remote push succeeded.

# 13. Pull Request Management

All substantive feature and bug-fix changes must use pull requests.

The agent must create a pull request after successfully pushing its feature branch.

Pull requests must contain:

**Title**
A concise description of the change.

**Summary**

- What changed.
- Why it changed.
- Which subsystems are affected.
- Relevant issue references.

**Implementation details**

- Architectural decisions.
- Database changes.
- API changes.
- Dependency changes.
- Security implications.

**Verification**

- Tests executed.
- Typechecking results.
- Lint results.
- Build results.
- Any skipped checks and reasons.

**Risk assessment**

- Potential regressions.
- Breaking changes.
- Migration risks.
- Deployment considerations.
- Rollback considerations.

**Acceptance criteria**
A checklist demonstrating completion.

Use the repository's pull request template.

The agent must not create misleading pull requests or claim independent approval.

# 14. Code Review Policy

Code review is mandatory for protected-branch integration.

Review must evaluate:

- Correctness.
- Architecture.
- Security.
- Maintainability.
- Performance.
- Error handling.
- Test coverage.
- Accessibility.
- Documentation.
- Backward compatibility.
- Database integrity.

The agent must perform a self-review before requesting approval.

However, self-review is not independent approval.

The agent must never approve its own pull request to satisfy a required review gate.

For a single-developer repository, the repository owner must provide the independent approval when branch protection requires it.

Do not weaken review requirements just because a reviewer is unavailable.

# 15. Continuous Integration

GitHub Actions must enforce project quality.

Create separate workflows where appropriate:

    .github/workflows/
      ci.yml
      pull-request.yml
      security.yml
      dependency-review.yml
      release.yml
      deploy.yml

### CI workflow

Run on:

- Pull requests.
- Pushes to relevant branches.
- Required scheduled verification where appropriate.

Required checks:

1. Checkout.
2. Dependency installation.
3. Formatting verification.
4. Linting.
5. Typechecking.
6. Unit tests.
7. Integration tests.
8. Production build.

### Security workflow

Include:

- Dependency vulnerability scanning.
- Secret scanning where available.
- Static analysis.
- CodeQL where appropriate.
- Dependency review.
- Workflow permission auditing.

### CI rules

- Use least-privilege GitHub token permissions.
- Pin third-party actions to reviewed versions or immutable commit SHAs where practical.
- Never print secrets.
- Avoid untrusted pull request code receiving privileged secrets.
- Cache dependencies safely.
- Use deterministic builds.
- Publish clear test results.

A pull request must not merge while required checks are failing.

# 16. Dependency Governance

All dependency changes require review.

The agent must:

1. Verify the package is necessary.
2. Check package maintenance.
3. Review compatibility.
4. Check license implications.
5. Evaluate security history.
6. Avoid duplicate functionality.
7. Update lockfiles.
8. Run tests and builds.

Configure Dependabot or an equivalent update process.

Dependency updates must use pull requests.

Security updates should receive priority based on severity and actual exposure.

Do not automatically accept major dependency upgrades without compatibility verification.

# 17. Database Change Management

Database changes require additional review.

Every database change must:

- Include a version-controlled migration.
- Be tested against a clean database.
- Be tested against an existing database.
- Preserve existing data unless explicitly authorized.
- Consider rollback and recovery.
- Document destructive operations.
- Maintain application compatibility during deployment.

For production systems, prefer backward-compatible expand-and-contract migrations.

Never deploy an irreversible destructive migration without an approved recovery plan.

# 18. Security Incident Workflow

If a vulnerability is discovered:

1. Assess severity.
2. Determine affected versions.
3. Identify exposure.
4. Create an appropriately restricted security issue.
5. Implement a fix on a controlled branch.
6. Add regression tests.
7. Review the change.
8. Run security checks.
9. Prepare a patch release where required.
10. Document remediation.

Do not publish sensitive vulnerability details in a public issue before responsible disclosure has been considered.

If a credential is exposed:

- Treat it as compromised.
- Notify the repository owner.
- Recommend immediate rotation.
- Remove it from active configuration.
- Investigate exposure.
- Follow an approved history-cleanup procedure if necessary.

Deleting a secret in a subsequent commit does not neutralize the exposure.

# 19. Release Management

Releases must be deliberate, verified, and reproducible.

Use Semantic Versioning:

    MAJOR.MINOR.PATCH

MAJOR:
Breaking changes.

MINOR:
Backward-compatible features.

PATCH:
Backward-compatible fixes.

Release workflow:

1. Confirm release scope.
2. Review merged pull requests.
3. Verify release branch or target commit.
4. Update version metadata.
5. Update CHANGELOG.md.
6. Run full verification.
7. Validate migrations.
8. Build release artifacts.
9. Create an annotated version tag.
10. Push the tag.
11. Create GitHub Release notes.
12. Attach appropriate artifacts.
13. Verify release availability.
14. Record the release.

Do not create a release after every feature branch push.

Do not publish a release unless explicitly authorized by the release policy or the repository owner.

Never invent release notes or include changes that were not actually merged.

# 20. Deployment Management

Production deployment must be separated from ordinary code pushes.

Required deployment stages:

    DEVELOPMENT
         ↓
    CI VERIFICATION
         ↓
    STAGING
         ↓
    STAGING VALIDATION
         ↓
    PRODUCTION APPROVAL
         ↓
    PRODUCTION DEPLOYMENT
         ↓
    HEALTH VERIFICATION
         ↓
    RELEASE CONFIRMATION

Requirements:

- Use separate deployment environments.
- Protect production environment secrets.
- Require appropriate approvals.
- Use immutable release artifacts where practical.
- Record deployed commit SHA.
- Verify health after deployment.
- Capture deployment logs.
- Maintain rollback instructions.

The agent may prepare deployment workflows and deployment plans.

Production deployment requires explicit authorization unless a separately approved automatic deployment policy exists.

# 21. Rollback and Recovery

Every production release must have a recovery strategy.

If deployment fails:

1. Stop further deployment.
2. Identify the failed release.
3. Review health checks and logs.
4. Determine the failure scope.
5. Restore the last known good application version when appropriate.
6. Verify service recovery.
7. Record the incident.
8. Create corrective work items.

Database rollback must not be assumed safe.

Use forward-fix migrations or documented recovery procedures when reversing database changes would risk data loss.

Never delete production data to make a deployment appear successful.

# 22. Post-Merge Verification

After an approved pull request merges:

1. Fetch the updated remote branch.
2. Verify the merge commit.
3. Run applicable post-merge checks.
4. Confirm the expected changes exist.
5. Verify CI results.
6. Update relevant issue status.
7. Delete the feature branch only when safe and permitted.
8. Report the integration result.

Do not report successful integration merely because a pull request was opened.

# 23. Engineering Documentation

Keep documentation synchronized with implementation.

Update relevant documentation when changing:

- Architecture.
- APIs.
- Database schemas.
- Configuration.
- Plugin interfaces.
- Editor document formats.
- Deployment procedures.
- Security requirements.
- User-facing workflows.

Significant architectural decisions must be recorded in:

    docs/architecture/decisions/

Use Architecture Decision Records containing:

- Context.
- Decision.
- Alternatives considered.
- Consequences.
- Date.
- Status.

# 24. Repository Maintenance

Perform regular repository maintenance through tracked work.

Areas include:

- Dependency updates.
- CI reliability.
- Build performance.
- Test reliability.
- Branch cleanup.
- Documentation accuracy.
- Security alerts.
- Issue triage.
- Release history.
- Repository permissions.

Do not delete branches or tags without confirming they are no longer needed.

Do not modify repository-wide settings without authorization.

# 25. GitHub Automation Permissions

The agent may automatically:

- Inspect repository state.
- Fetch remote updates.
- Create authorized working branches.
- Commit verified changes.
- Push feature branches.
- Create pull requests.
- Update its pull request descriptions.
- Read CI results.
- Inspect review comments.
- Respond to review feedback.
- Push corrections to its own feature branch.
- Create engineering issues when necessary.
- Update issue status when justified.
- Prepare release notes.
- Prepare deployment plans.

The agent may not automatically:

- Force-push shared branches.
- Bypass branch protection.
- Approve its own pull requests.
- Merge without satisfying required checks and reviews.
- Change repository visibility.
- Change organization-wide permissions.
- Delete repositories.
- Delete protected branches.
- Publish production releases without authorization.
- Deploy to production without authorization.
- Delete production data.
- Disable security controls.

These restrictions are mandatory.

# 26. Engineering Completion Reports

Every completed task must produce a concise but verifiable report.

Required format:

    ENGINEERING TASK REPORT

    Task:
    Issue:
    Branch:

    IMPLEMENTATION
    - Changes:
    - Files:
    - Architecture impact:

    VERIFICATION
    - Formatting:
    - Lint:
    - Typecheck:
    - Tests:
    - Build:
    - Security:

    GITHUB
    - Commit SHA:
    - Remote push:
    - Pull request:
    - CI status:
    - Review status:
    - Merge status:

    RELEASE
    - Version:
    - Deployment:
    - Health status:

    RISKS
    - Known issues:
    - Follow-up work:

Only report operations that actually occurred.

Use explicit states:

- NOT RUN
- RUNNING
- PASSED
- FAILED
- BLOCKED
- NOT APPLICABLE

Never use a successful status for an operation that was not verified.

# 27. Mandatory Automation Behavior

When an implementation task is completed successfully, the agent must not wait for an additional instruction to perform routine authorized GitHub operations.

The default behavior is:

1. Finish implementation.
2. Run required local checks.
3. Review all changes.
4. Commit the changes.
5. Push the feature branch.
6. Open a pull request when appropriate.
7. Monitor CI.
8. Correct failures introduced by the implementation.
9. Update the pull request.
10. Request independent review.
11. Wait for required approval.
12. Integrate only after all repository rules are satisfied.
13. Verify the resulting integration.
14. Report the final state.

The agent must continue handling authorized work through the GitHub workflow rather than stopping after writing source code.

If a required operation is blocked by permissions, unavailable infrastructure, failed checks, or review requirements, report the exact blocker and the next required action.

# 28. First-Time Repository Setup

Before relying on this workflow, inspect and configure the GitHub repository.

Verify:

- Default branch.
- Branch protection or rulesets.
- Required CI checks.
- Pull request settings.
- CODEOWNERS.
- Issue templates.
- Pull request template.
- GitHub Actions permissions.
- Secret scanning availability.
- Dependabot configuration.
- Environment protection.
- Release permissions.

Create or update the relevant configuration files.

Do not claim repository governance is operational until the actual GitHub settings have been checked.

# 29. Definition of Operational Success

The GitHub engineering operation is considered established when:

- All work is traceable.
- Feature branches are consistently used.
- Pull requests are the integration mechanism.
- Automated verification is enforced.
- Code review requirements are enforced.
- Security checks are active.
- Dependency changes are reviewed.
- Releases are versioned and documented.
- Production deployment is controlled.
- Rollback procedures are documented.
- GitHub activity is auditable.
- Completion reports accurately reflect reality.

The objective is not simply to automate Git commands.

The objective is to establish a reliable engineering organization around the repository.

# 30. CodeRabbit — Mandatory AI Code Review

CodeRabbit is the designated automated code-review system for this repository.

It operates as an independent review layer between implementation and approval.

The coding agent is responsible for implementation. CodeRabbit is responsible for independently analyzing proposed changes and identifying potential problems.

Neither replaces the other.

## 30.1 Required Review Sequence

Every substantive pull request must follow this sequence:

1. Coding agent completes implementation.
2. Coding agent runs local tests and quality checks.
3. Coding agent pushes its feature branch.
4. Coding agent opens a pull request.
5. CodeRabbit automatically reviews the pull request.
6. Coding agent waits for the completed review.
7. Coding agent examines every actionable finding.
8. Coding agent fixes valid findings.
9. Coding agent pushes corrective commits.
10. CodeRabbit reviews the updated changes.
11. Coding agent verifies that all required findings are resolved or appropriately dispositioned.
12. GitHub CI must pass.
13. Independent human approval must be obtained.
14. Pull request becomes eligible for merging.

## 30.2 CodeRabbit Configuration

Maintain repository-level configuration:

    .coderabbit.yaml

Configure CodeRabbit to:

- Automatically review non-draft pull requests.
- Review incremental changes after new commits.
- Provide high-level summaries.
- Identify correctness issues.
- Identify security vulnerabilities.
- Identify performance problems.
- Identify architectural problems.
- Identify maintainability problems.
- Review TypeScript types and API contracts.
- Review database migrations.
- Review React and Next.js implementation.
- Review accessibility concerns.
- Identify missing tests.
- Review error handling.
- Review potential regressions.
- Evaluate documentation changes.

Use path-specific review instructions for critical subsystems.

CodeRabbit must understand the repository's architecture and project specifications.

Reference these files in review guidance:

- AGENTS.md
- ARCHITECTURE.md
- DATABASE.md
- EDITOR-SPEC.md
- DESIGN-SYSTEM.md
- PLUGIN-SYSTEM.md
- GIT-WORKFLOW.md

## 30.3 Review Severity

Classify findings by actual impact.

**Critical**

- Security vulnerabilities.
- Data corruption.
- Authentication bypass.
- Authorization bypass.
- Remote code execution.
- Severe production failures.

**High**

- Major functional defects.
- Breaking API behavior.
- Serious performance regressions.
- Unsafe database operations.
- Significant architectural violations.

**Medium**

- Incorrect edge-case behavior.
- Missing error handling.
- Maintainability issues with meaningful impact.
- Missing important tests.
- Accessibility problems.

**Low**

- Minor improvements.
- Non-critical optimization.
- Style or clarity suggestions.

Do not treat every stylistic suggestion as a blocker.

## 30.4 Finding Resolution

For every actionable finding:

1. Read the complete finding.
2. Inspect the relevant source code.
3. Determine whether the finding is valid.
4. Fix valid defects.
5. Add or update regression tests.
6. Explain findings that are incorrect or not applicable.
7. Document accepted risks when a finding is deliberately deferred.

Never blindly apply AI-generated code suggestions.

Never dismiss a security or data-integrity finding without investigation.

## 30.5 Re-Review Requirements

After corrective commits:

- Push the updated branch.
- Allow CodeRabbit to review the new changes.
- Confirm that the latest review corresponds to the latest commit.
- Inspect new findings.
- Repeat the correction process where necessary.

A review of an older commit does not qualify as approval of newer code.

If CodeRabbit is pending, unavailable, rate-limited, or fails to execute, report the actual state and wait.

A skipped review is not a clean review.

## 30.6 Merge Gate

A pull request is eligible for merging only when:

- CodeRabbit completed its review.
- Critical findings are resolved.
- High-severity findings are resolved or explicitly accepted by an authorized human.
- Medium findings are addressed or documented with justification.
- Required CI checks pass.
- Required independent approval is obtained.
- All required conversations are resolved.
- The reviewed commit matches the commit being merged.

CodeRabbit is an advisory review system unless an independently enforced GitHub check or supported pre-merge policy makes a particular condition mandatory.

Do not assume CodeRabbit comments automatically enforce GitHub branch protection.

Configure actual GitHub rulesets and required checks separately.

CodeRabbit does not replace human approval.

## 30.7 Review Commands

Where automatic review does not execute, use the supported pull-request commands:

    @coderabbitai review

For a complete review:

    @coderabbitai full review

To inspect effective configuration:

    @coderabbitai configuration

Never treat a review request being submitted as proof that the review completed.

## 30.8 Final Review Report

Include:

    CODERABBIT REVIEW

    Review status:
    Reviewed commit:
    Critical findings:
    High findings:
    Medium findings:
    Low findings:

    Findings fixed:
    Findings dismissed with justification:
    Findings accepted as risks:

    Follow-up review:
    Final review status:

    MERGE ELIGIBILITY:
    Eligible / Blocked

Never mark a pull request eligible for merging when a mandatory review has not completed.

## 30.9 Mandatory Policy

CodeRabbit must participate in every substantive pull-request review.

The coding agent must not merge its own implementation simply because its local tests pass.

The purpose of this integration is to establish independent automated scrutiny before code enters the protected production branch.
