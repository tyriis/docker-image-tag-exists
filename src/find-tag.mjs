import axios from "axios"
import { execSync } from "child_process"

const debug = process.env.NODE_LOG_LEVEL === "debug"

const registryMessagesMap = {
  docker: "no such manifest",
  ecr: "no such manifest",
  github: "manifest unknown",
  google: "no such manifest",
  harbor: "unknown: artifact",
}

// reduce the mapping to an array with unique value strings
const registryMessages = Array.from(new Set(Object.values(registryMessagesMap)))

export const findTag = async (registry, repository, tag, token) => {
  try {
    if (debug) {
      console.log(JSON.stringify({ registry, repository, tag, token: !!token }, null, 2))
    }

    let result = null
    if (token) {
      const response = await axios.get(`https://${registry}/v2/${repository}/manifests/${tag}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      result = JSON.stringify(response.data)
    } else {
      result = execSync(`docker manifest inspect ${registry}/${repository}:${tag}`, { encoding: "utf8" })
    }

    if (debug) {
      console.log(result)
    }
    console.log("container image tag found")
    return true
  } catch (error) {
    if (debug) {
      console.error(error)
    }

    if (token && axios.isAxiosError(error) && error.response?.status === 404) {
      console.log("container image tag not found")
      return false
    }

    for (const item of registryMessages) {
      if (token) {
        // don't use response message parsing when using axios
        break
      }
      if (debug) {
        console.log(JSON.stringify({ item }))
      }
      if (error.message.includes(item)) {
        console.log("container image tag not found")
        return false
      }
    }
    throw error
  }
}
