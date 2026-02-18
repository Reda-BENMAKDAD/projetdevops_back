import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;
  @IsString()
  @MinLength(8, { message: 'le mot de passe doit avoir une longueur minimal de 8 charactères' })
  password!: string;
}
