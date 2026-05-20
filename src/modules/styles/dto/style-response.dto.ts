export class StyleResponseDto {
  id!: string;
  name!: string;
}

export class ListStylesResponseDto {
  items!: StyleResponseDto[];
  total!: number;
}
