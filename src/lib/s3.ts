import "server-only";
import AWS from "aws-sdk";

export interface S3FileBlob {
  fileName: string;
  blob: Blob;
}

function getS3Client() {
  AWS.config.update({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });

  return new AWS.S3({
    params: {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    },
    region: process.env.AWS_REGION ?? "us-east-1",
  });
}

export async function uploadToS3(file: File) {
  try {
    const s3 = getS3Client();

    const file_key = `uploads/${Date.now().toString()}${file.name.replace(
      " ",
      "-"
    )}`;

    const body = Buffer.from(await file.arrayBuffer());

    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: body,
      ContentType: "application/pdf",
    };

    await s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        console.log(
          "Uploading to s3...",
          ((evt.loaded * 100) / evt.total).toFixed(0),
          "%"
        );
      })
      .promise();

    console.log("Sucessfully uploaded to S3!");

    return {
      file_key,
      file_name: file.name,
    };
  } catch (e) {
    console.error(e);
  }
}

export function getS3Url(file_key: string) {
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${file_key}`;
}

export async function deleteFromS3(file_key: string) {
  const s3 = getS3Client();

  await s3
    .deleteObject({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    })
    .promise();
}

export async function downloadFromS3(
  file_key: string
): Promise<S3FileBlob | null> {
  try {
    const s3 = getS3Client();

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    const obj = await s3.getObject(params).promise();
    return {
      fileName: file_key,
      blob: new Blob([obj.Body as any]),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
