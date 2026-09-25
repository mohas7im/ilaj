import { apiClient } from "@/lib/apiClient"

export async function uploadImage(
  file: File,
  folder: string = "general"
): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)

  const { data } = await apiClient.post<{ url: string }>("/api/admin/upload", formData)
  return data.url
}
