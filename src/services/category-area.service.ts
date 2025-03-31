import { CategoryAreaResponseDto } from '@src/dto/category-area/category-area.dto';
import { CategoryAreaRepository } from '@src/repositories/category-area.repository';

export class CategoryAreaService {
  constructor(private readonly categoryAreaRepository: CategoryAreaRepository) {}

  async getCategoryAreas(): Promise<CategoryAreaResponseDto[]> {
    const categoryAreas = await this.categoryAreaRepository.getAll();
    return categoryAreas.map(
      (categoryArea) => new CategoryAreaResponseDto(categoryArea.id, categoryArea.name),
    );
  }
}
