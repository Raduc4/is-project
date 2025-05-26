import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import * as fs from "fs";
import { PrismaService } from "src/prisma/prisma.service";

export interface AvatarImage {
  buffer: Buffer;
  mimetype: MType;
}

export type MType = "image/jpeg" | "image/png";
@Injectable()
export class ImagesService {
  constructor(private readonly prismaService: PrismaService) {}
  AWS_S3_BUCKET = "ment-avatars";
  s3 = new AWS.S3({
    accessKeyId: "AKIA3N3JK6TZC47DWXM7",
    secretAccessKey: "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",
  });

  async uploadAvatar(base64: string, imageType: string, newUserId: string) {
    return await this.uploadFile(base64, imageType, newUserId).then(
      async (imageObject) => {
        return await this.prismaService.user.update({
          where: { id: newUserId },
          data: {
            avatar: imageObject.Location,
          },
        });
      }
    );
  }

  toBase64(filePath) {
    const img = fs.readFileSync(filePath);

    return Buffer.from(img).toString("base64");
  }

  async uploadAvatars(
    images: Array<{
      base64: string;
      type: string;
      id: string;
    }>
  ) {
    return await Promise.all(
      images.map(async (image) => {
        return await this.uploadFile(image.base64, image.type, image.id);
      })
    );
  }

  async uploadFile(base64: string, type: string, id: string) {
    const base64Data = Buffer.from(
      base64.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    return await this.s3_upload(
      base64Data,
      this.AWS_S3_BUCKET,
      `${id}.${type}`,
      type
    );
  }
  // async uploadFile(): Promise<any> {
  //   const base = this.toBase64(
  //     '/home/alu/projects/mobile/meent-back/src/s3/test.jpg',
  //   );
  //   const base64Data = Buffer.from(
  //     base.replace(/^data:image\/\w+;base64,/, ''),
  //     'base64',
  //   );
  //   await this.s3_upload(
  //     base64Data,
  //     this.AWS_S3_BUCKET,
  //     `xd.${'image/jpeg'.split('/')[1]}`,
  //     'image/jpeg',
  //   );
  // }

  async s3_upload(file: Buffer, bucket: any, name: string, mimetype: string) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: "public-read",
      ContentType: `image/${mimetype}`,
      ContentDisposition: "inline",
      ContentEncoding: "base64",
      ContentLength: file.length,
    };

    try {
      let s3Response = await this.s3.upload(params).promise();

      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
