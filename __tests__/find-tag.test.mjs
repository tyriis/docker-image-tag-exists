import { findTag } from "../src/find-tag.mjs"
import { describe, test } from "@jest/globals"

describe("findTag function", () => {
  test("should find docker.io/library/nginx:latest", async () => {
    await expect(findTag("docker.io", "library/nginx", "latest")).resolves.toBe(true)
  })

  test("should not find docker.io/library/nginx:fail", async () => {
    await expect(findTag("docker.io", "library/nginx", "fail")).resolves.toBe(false)
  })

  test("should find ghcr.io/github/super-linter:latest", async () => {
    await expect(findTag("ghcr.io", "github/super-linter", "latest")).resolves.toBe(true)
  })

  test("should not find ghcr.io/github/super-linter:fail", async () => {
    await expect(findTag("ghcr.io", "github/super-linter", "fail")).resolves.toBe(false)
  })

  // test("should find gcr.io/google-containers/busybox:latest", async () => {
  //   await expect(findTag("gcr.io", "google-containers/busybox", "latest")).resolves.toBe(true)
  // })

  // test("should not find gcr.io/google-containers/busybox:fail", async () => {
  //   await expect(findTag("ghcr.io", "google-containers/busybox", "fail")).resolves.toBe(false)
  // })

  test("should find public.ecr.aws/eks-anywhere/tinkerbell/tink/nginx:v0.10.1-eks-a-77", async () => {
    await expect(findTag("public.ecr.aws", "eks-anywhere/tinkerbell/tink/nginx", "v0.10.1-eks-a-77")).resolves.toBe(
      true
    )
  })

  test("should not find public.ecr.aws/eks-anywhere/tinkerbell/tink/nginx:fail", async () => {
    await expect(findTag("public.ecr.aws", "eks-anywhere/tinkerbell/tink/nginx", "fail")).resolves.toBe(false)
  })
})
