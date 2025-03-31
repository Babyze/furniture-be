import { GetProductResponseDto } from '@src/dto/customer/product/get-product.dto';
import {
  GetProductItemResponseDto,
  GetProductsQueryDto,
  GetProductsResponseDto,
} from '@src/dto/customer/product/get-products.dto';
import { ProductRepository } from '@src/repositories/product.repository';

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts(
    filter: GetProductsQueryDto,
    hostname: string,
  ): Promise<GetProductsResponseDto> {
    const results = await this.productRepository.getProducts(filter);
    const items = results.items.map<GetProductItemResponseDto>((item) => {
      if (item.imageUrl) {
        item.imageUrl = `${hostname}/${item.imageUrl}`;
      }

      return {
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        minPrice: item.minPrice,
        maxPrice: item.maxPrice,
        stock: item.stock,
        categoryId: item.categoryId,
        categoryAreaId: item.categoryAreaId,
      };
    });

    return {
      items,
      meta: results.meta,
    };
  }

  async getProduct(id: number, hostname: string): Promise<GetProductResponseDto> {
    const product = await this.productRepository.getProduct({
      productId: id,
    });
    const imageUrl = product.imageUrl ? `${hostname}/${product.imageUrl}` : '';

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      measurements: product.measurements,
      imageUrl: imageUrl,
      categoryName: product.categoryName,
      categoryAreaName: product.categoryAreaName,
    };
  }
}
