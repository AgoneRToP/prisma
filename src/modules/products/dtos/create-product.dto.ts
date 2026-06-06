import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Min,
  IsInt,
  IsPositive,
  ValidateNested,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

const textRegex = /^[a-zA-Z0-9а-яА-ЯёЁўЎқҚғҒҳҲoʻgʻOʻGʻ‘’'ʻ\s.,!?-]+$/;

export class BaseLanguageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'eng: The text must contain at least 2 characters' })
  @MaxLength(500, { message: 'eng: The text must not exceed 500 characters' })
  @Matches(textRegex, {
    message: 'English text contains invalid characters',
  })
  eng: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'uzb: Matn kamida 2 ta belgidan iborat boʻlishi kerak',
  })
  @MaxLength(500, { message: 'uzb: Matn 500 ta belgidan oshmasligi kerak' })
  @Matches(textRegex, {
    message: 'Oʻzbekcha matnda taqiqlangan belgilar mavjud',
  })
  uzb: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'узб: Матн камида 2 та белгидан иборат бўлиши керак',
  })
  @MaxLength(500, { message: 'узб: Матн 500 та белгидан ошмаслиги керак' })
  @Matches(textRegex, {
    message: 'узб: Матнда тақиқланган белгилар мавжуд'
  })
  узб: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'рус: Текст должен содержать минимум 2 символа' })
  @MaxLength(500, { message: 'рус: Текст не должен превышать 500 символов' })
  @Matches(textRegex, {
    message: 'Русский текст содержит недопустимые символы',
  })
  рус: string;
}

export class CreateProductDto {
  @ValidateNested()
  @Type(() => BaseLanguageDto)
  name: Record<string, string>;

  @IsOptional()
  @ValidateNested()
  @Type(() => BaseLanguageDto)
  description: Record<string, string>;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsPositive()
  @Min(0)
  @IsNotEmpty()
  quantity: number;
}
