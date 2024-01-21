import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";
import type { NextApiRequest, NextApiResponse } from "next";
import { handleAuth } from "@src/api/auth/util";
import { z } from "zod";

// Define a schema for the request body using Zod
const bodySchema = z.object({});

/**
 * API handler for file upload.
 * This endpoint is protected by authentication using handleAuth.
 */
export default handleAuth<Body>({
  mode: "client",
  name: "file|upload",
  methods: ["POST"],
  schemas: {
    body: bodySchema,
  },
  handler: async (request: NextApiRequest, response: NextApiResponse) => {
    // Destructure relevant properties from the request body
    const { file_type, file_name } = request.body;

    // Ensure that AWS_MONITORING_BUCKET_KEY and AWS_MONITORING_BUCKET_SECRET are strings
    const accessKeyId = process.env.NEXT_PUBLIC_AWS_MONITORING_BUCKET_KEY as string;
    const secretAccessKey = process.env.NEXT_PUBLIC_AWS_MONITORING_BUCKET_SECRET as string;

    // Initialize S3 client
    const client = new S3Client({
      region: "eu-central-1",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Set key for storing the file
    const Key = `monitoring/medias/${file_name}`;

    // Create a PutObjectCommand with the necessary parameters
    const command = new PutObjectCommand({
      Bucket: "opusflow-monitoring",
      Key,
      ContentType: "application/octet-stream",
      ACL: "private",
    });

    // Get a signed URL for the S3 upload
    const url = await getSignedUrl(client, command, { expiresIn: 300 });

    // Check if the URL was successfully generated
    if (!url) {
      console.error(`Internal server error: Something went wrong generating URL for file ${Key} from S3`);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Internal server error",
          message: `Something went wrong generating URL for file ${Key} from S3`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Log success and return the signed URL in the response
    console.log(`Successfully created upload URL for file: ${Key} ${file_type} from S3`);
    return response.status(200).json({
      url,
    });
  },
});
