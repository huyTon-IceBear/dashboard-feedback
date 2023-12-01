import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(request: Request) {
  const { file_name, expiresIn = 60 } = await request.json();

  // Ensure that AWS_MONITORING_BUCKET_KEY and AWS_MONITORING_BUCKET_SECRET are strings
  const accessKeyId = process.env.NEXT_PUBLIC_AWS_MONITORING_BUCKET_KEY as string;
  const secretAccessKey = process.env.NEXT_PUBLIC_AWS_MONITORING_BUCKET_SECRET as string;

  //Init s3 client
  const client = new S3Client({
    region: 'eu-central-1',
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const command = new GetObjectCommand({
    Bucket: 'opusflow-monitoring',
    Key: `monitoring/medias/${file_name}`,
  });

  const url = await getSignedUrl(client, command, { expiresIn });

  if (!url) {
    console.error(
      `Internal server error: Something went wrong generating url for file ${file_name} from S3`
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: `Something went wrong generating url for file ${file_name} from S3`,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  return Response.json({ url });
}
