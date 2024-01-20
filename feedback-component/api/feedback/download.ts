import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	const { file_type, file_name } = request.body;

	// Ensure that AWS_MONITORING_BUCKET_KEY and AWS_MONITORING_BUCKET_SECRET are strings
	const accessKeyId = process.env.NEXT_PUBLIC_AWS_MONITORING_BUCKET_KEY as string;
	const secretAccessKey = process.env.NEXT_PUBLIC_AWS_MONITORING_BUCKET_SECRET as string

	//Init s3 client
	const client = new S3Client({
		region: "eu-central-1",
		credentials: {
			accessKeyId,
			secretAccessKey,
		}
	});

	// Set key for the storing the file
	const Key = `monitoring/medias/${file_name}`;

	const command = new PutObjectCommand({
		Bucket: "opusflow-monitoring",
		Key,
		ContentType: "application/octet-stream",
		ACL: "private",
	});
	const url = await getSignedUrl(client, command, { expiresIn: 300 });

	if (!url) {
		console.error(`Internal server error: Something went wrong generating url for file ${Key} from S3`);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: "Internal server error",
				message: `Something went wrong generating url for file ${Key} from S3`,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		};
	}
	console.log(`Successfully created upload url for file: ${Key} ${file_type} from S3`);
	return response.status(200).json({
		url,
		key: Key,
	});
}
