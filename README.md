<!-- markdownlint-disable MD041 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD028 -->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![taskfile][taskfile-shield]][taskfile-url]
[![pre-commit][pre-commit-shield]][pre-commit-url]

# Docker Image Tag Exists

This action query a docker container registry to check if a given tag exists.

<details>
  <summary style="font-size:1.2em;">Table of Contents</summary>
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [User Story](#user-story)
- [The Idea](#the-idea)
- [What's new](#whats-new)
- [Limitations](#limitations)
- [Usage](#usage)
  - [Outputs](#outputs)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## User Story

As a user I want to know if a docker image tag already exists in a registry, this is required to prevent same commit to be build more then once (f.e. re-tagging an existing image after a release workflow).

## The Idea

In order to be able to determine if the container image already exists we can try to get the manifest data from the registry.
If the manifest exists the image + tag exists otherwise the request will fail and the image tag is not found.

## What's new

First implementation is currently tested, use at own risk

- [x] tested docker.io Registry
- [x] tested ghcr.io Registry
- [x] tested Google Artifact Registry
- [x] tested Amazon Elastic Container Registry
- [x] tested Harbor Registry

- Issues with hosted arc runners in Google Cloud, implemented a http request as fallback, only tested with google cloud so far

## Limitations

The return message of the registry is not standarized, please open a PR or create an issue if you encounter trouble with your registry.

## Usage

<!-- start usage -->

```yaml
- uses: tyriis/docker-image-tag-exists@v2.1.0
  with:
    # The container image registry
    registry: docker.io

    # The container image name
    repository: nginx

    # The container image tag
    tag: "1"
```

### Outputs

| name | type   | description            |
| ---- | ------ | ---------------------- |
| tag  | string | `found` or `not found` |

<!-- end usage -->

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

<!-- Badges -->

[taskfile-shield]: https://img.shields.io/badge/Taskfile-Enabled-brightgreen?style=for-the-badge&logo=task
[taskfile-url]: https://taskfile.dev/
[pre-commit-shield]: https://img.shields.io/badge/pre--commit-enabled-brightgreen?style=for-the-badge&logo=pre-commit
[pre-commit-url]: https://github.com/pre-commit/pre-commit
