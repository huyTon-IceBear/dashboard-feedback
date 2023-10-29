// Linear SDK
import { LinearClient, LinearFetch, User } from "@linear/sdk";
import { TaskLinear } from 'src/types/task';

import { LINEAR_API_TEST } from 'src/config-global';

// Api key authentication
const client1 = new LinearClient({
  apiKey: LINEAR_API_TEST
})

/** Uploads a file to Linear, returning the uploaded URL. @throws */
export async function uploadFileToLinear(file: File): Promise<string> {
  const uploadPayload = await client1.fileUpload(file.type, file.name, file.size);

  if (!uploadPayload.success || !uploadPayload.uploadFile) {
    throw new Error("Failed to request upload URL");
  }

  const uploadUrl = uploadPayload.uploadFile.uploadUrl;
  const assetUrl = uploadPayload.uploadFile.assetUrl;

  // Make sure to copy the response headers for the PUT request
  const headers = new Headers();
  headers.set("Content-Type", file.type);
  headers.set("Cache-Control", "public, max-age=31536000");
  uploadPayload.uploadFile.headers.forEach(({ key, value }) => headers.set(key, value));

  try {
    await fetch(uploadUrl, {
      method: "PUT",
      headers,
      body: file
    });

    return assetUrl;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to upload file to Linear");
  }
}
