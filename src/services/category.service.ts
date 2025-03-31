import { CategoryResponseDto } from '@src/dto/category/category.dto';
import { CategoryRepository } from '@src/repositories/category.repository';

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.getAll();
    return categories.map((category) => new CategoryResponseDto(category.id, category.name));
  }
}
