This is a guide to help you through code reviews and how to comment on them.

## 📋 Description

As [GitHub's documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) says:

> A pull request is a proposal to merge a set of changes from one branch into another. In a pull request, collaborators can review and discuss the proposed set of changes before they integrate the changes into the main codebase. Pull requests display the differences, or diffs, between the content in the source branch and the content in the target branch.

## ☑️ Feature PR checklist

When you approve a PR, you're offering your personal guarantee that:

1. The PR does what it's supposed to _(prerequisite: you know what it's supposed to do!)_

1. You understand how it does that _(remember at some point in the future you may be asked to explain or maintain that code)_

1. You can't think of any problems with the way it does that, or any better alternatives _(some of those alternatives may have already been considered and dismissed by the author, and if so it's useful for them to include that in the PR description - e.g. see https://github.com/typicode/json-server/pull/1174 where the author explicitly spells out some of the things they \_didn't_ implement)\_

You should be going through the following:

- **Pull request** - read the content of the user story/task and of the PR itself (_Conversation_ tab) and consider the following questions:

  - Is the user story/ticket linked?

  - Does the description match the linked item?

  - Does the description tell you how to validate the work?

  - What approach would you take to meet this goal?

  - _(If there are previous rounds of feedback or other comments)_

    - Do you agree or disagree with the previous feedback?
    - Has that feedback been adequately dealt with by the author?

- **Build** - review the results of the CI pipeline (_Checks_ tab) and consider the following question:

  - Does the build still pass?

- **Code changes** - read through the changeset (_Files changed_ tab, or _Commits_ tab to see the changes step-by-step) and consider the following questions:

  - Do the code changes match the description?

  - Are there any changes that should not be part of this pull request (e.g. changes in files not related to the functionality)?

  - Do you understand what the changes are doing, how they meet the goal of the PR?

  - Does the approach to meeting those goals seem sensible? If it's not the one you thought of, is it significantly better or worse?

  - Is this well-structured code (consistent layout, comprehensible variable names, relatively small files)?

- **Behaviour changes** - check out the PR branch, run the software locally and consider the following questions:

  - Does the product still start and run correctly?

  - Is the goal of the pull request met (i.e. new behaviour for a new feature, changed behaviour for a bug fix, identical behaviour for a refactor)?

  - In the parts of the product this PR touched:

    - Is the spelling, punctuation and grammar for user-facing text correct?

    - Does the layout/UI match the designs?

- **Project progress**:

  - Have new tickets been created to cover any additional actions that have appeared during this review?

## 🏁 Creating a review

### ✅ **Do**

- Provide comments on the code and PR so your work is visible

- Prefer **Approve** or **Request changes**, to be clear about whether you think the code is ready to merge or not, over **Comment** (or leaving a regular comment in the _Conversation_ tab)

- Explain what you did to validate the work, e.g.

  > I checked the build and I can see the new linting step passing. Running the linting locally on the PR branch also works. If I change the rule back to the old version, I see a lint failure which would be caught in CI.

### 🤔 **Consider**

- Classifying your comments so the author understands what action to take, e.g.:

  - ✅ looks good, no change needed before approval

  - ❓ question, needs answer before approval

  - ❌ problem, needs fixing before approval

  - 💡 suggestion, no change needed before approval

### ❌ **Don't**

- Leave trivial comments like 👍, LGTM (_"looks good to me"_) or nothing at all

## 📚 Resources

- [Example reviews](https://github.com/CodeYourFuture/tech-products-demo/pulls?q=is%3Apr+-review%3Anone) in the `CodeYourFuture/tech-products-demo` project

- [Reviewing Pull Requests](https://chelseatroy.com/2019/12/18/reviewing-pull-requests/) by Chelsea Troy

  - Part of [this helpful series](https://chelseatroy.com/tag/temporally-distributed/)

- [Code Review Guidelines for Humans](https://phauer.com/2018/code-review-guidelines/) by Philipp Hauer

- [Code Reviews: Hints, tips & principles](https://medium.com/accurx/code-reviews-hints-tips-principles-cc778a2b2611) by Benjamin Osborne @ Accurx

- [Pull Request Best Practices: Our Tips](https://linearb.io/blog/pull-request-best-practices-our-tips#pull-requests-best-practices-for-the-reviewer) by Carlos Schults @ LinearB

- [Top ten pull request review mistakes](https://blog.scottnonnenberg.com/top-ten-pull-request-review-mistakes/) by Scott Nonnenberg

- [Code Review Antipatterns](https://www.chiark.greenend.org.uk/~sgtatham/quasiblog/code-review-antipatterns/) by Simon Tatham
