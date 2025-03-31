import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { GetSPUsRequestParamsDto } from '@src/dto/seller/spu/get-spus.dto';
import { SPUService } from '@src/services/seller/spu.service';
import { NextFunction, Request, Response } from 'express';

export class SPUController {
  constructor(private readonly spuService: SPUService) {}

  getSPUs = async (
    req: Request<GetSPUsRequestParamsDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { productId } = req.params;
      const results = await this.spuService.getSPUs(productId);
      res.status(HTTP_STATUS.OK).json(results);
    } catch (error) {
      next(error);
    }
  };
}
