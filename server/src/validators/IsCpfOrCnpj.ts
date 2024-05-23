import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsCpfOrCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value, _) => {
          if (typeof value !== 'string') {
            return false;
          }
          const stripped = value.replace(/\D/g, '');
          return stripped.length === 11 || stripped.length === 14;
        },
        defaultMessage: () => '$property is not CPF or CNPJ',
      },
    });
  };
}
