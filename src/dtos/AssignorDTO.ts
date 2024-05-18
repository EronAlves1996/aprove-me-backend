import { IsEmail, IsPhoneNumber, IsUUID, Length } from 'class-validator';
import { IsCpfOrCnpj } from 'src/validators/IsCpfOrCnpj';

export class AssignorDTO {
  @IsUUID()
  id: string;

  @Length(0, 30)
  @IsCpfOrCnpj()
  document: string;

  @Length(0, 140)
  @IsEmail()
  email: string;

  @Length(0, 20)
  @IsPhoneNumber('BR')
  phone: string;

  @Length(0, 140)
  name: string;
}
