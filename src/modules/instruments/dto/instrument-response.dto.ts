export class InstrumentCategoryResponseDto {
  id!: string;
  name!: string;
}

export class ListInstrumentCategoriesResponseDto {
  items!: InstrumentCategoryResponseDto[];
  total!: number;
}

export class InstrumentResponseDto {
  id!: string;
  name!: string;
  categoryId!: string;
  category!: InstrumentCategoryResponseDto;
}

export class ListInstrumentsResponseDto {
  items!: InstrumentResponseDto[];
  total!: number;
}
