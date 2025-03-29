import { GetSPUsResponseDto } from '@src/dto/seller/spu/get-spus.dto';
import { SKU } from '@src/models/sku.model';
import { SKURepository } from '@src/repositories/sku.repository';
import { SPURepository } from '@src/repositories/spu.repository';

export class SPUService {
  constructor(
    private readonly spuRepository: SPURepository,
    private readonly skuRepository: SKURepository,
  ) {}

  async getSPUs(productId: number): Promise<GetSPUsResponseDto[]> {
    const spus = await this.spuRepository.getSPUsByProductId(productId);
    const skus: SKU[] = [];
    for (const spu of spus) {
      const sku = await this.skuRepository.getSKUBySPUId(spu.id);
      if (sku) skus.push(sku);
    }

    return spus.map((spu) => {
      const skusBySPU = skus.find((sku) => sku.spuId === spu.id);
      return {
        name: spu.name,
        price: skusBySPU?.price ?? 0,
        quantity: skusBySPU?.quantity ?? 0,
      };
    });
  }
}
