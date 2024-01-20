import fetch, { Headers } from 'node-fetch';
import { LinearClient } from '@linear/sdk';
import { LINEAR_API_TEST, LINEAR_API_OPUS } from 'src/config-global';
import axios from 'src/utils/axios';

const linearClient = new LinearClient({ apiKey: LINEAR_API_TEST });

export async function POST(request: Request) {
  const { presignedUrl } = await request.json();
  // Download the file from the s3 pre-signed URL
  try {
    const response = await axios.get(presignedUrl, { responseType: 'arraybuffer' });
    const fileBuffer = response.data;
    const fileSize = response.headers['content-length'];
    const fileName = presignedUrl.split('/').pop();
    const fileMimetype = response.headers['content-type'];
    const fileSizeInInt = parseInt(fileSize);

    if (
      typeof fileName === 'undefined' ||
      typeof fileMimetype === 'undefined' ||
      typeof fileSize === 'undefined'
    ) {
      throw new Error('One or more required properties are undefined');
    }

    const uploadPayload = await linearClient.fileUpload(fileMimetype, fileName, fileSizeInInt);

    if (!uploadPayload.success || !uploadPayload.uploadFile) {
      throw new Error('Failed to request upload URL');
    }

    const uploadUrl = uploadPayload.uploadFile.uploadUrl;
    const assetUrl = uploadPayload.uploadFile.assetUrl;

    // Make sure to copy the response headers for the PUT request
    const headers = new Headers();

    // It is important that the content-type of the request matches the value passed as the first argument to `fileUpload`.
    headers.set('Content-Type', fileMimetype);
    headers.set('Cache-Control', 'public, max-age=31536000');
    uploadPayload.uploadFile.headers.forEach(({ key, value }) => headers.set(key, value));

    try {
      const response = await fetch(uploadUrl, {
        // Note PUT is important here, other verbs will not work.
        method: 'PUT',
        body: fileBuffer,
        headers,
      });

      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }

      return Response.json({ assetUrl });
    } catch (e) {
      throw new Error('Failed to upload file to Linear', { cause: e });
    }
  } catch (err) {
    console.log(err);
  }
}
