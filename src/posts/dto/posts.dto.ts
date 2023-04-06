import { IsNotEmpty, IsString } from 'class-validator';

export class createPostDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}

export class createCommentDto {
  @IsNotEmpty()
  @IsString()
  comment: string;
}
