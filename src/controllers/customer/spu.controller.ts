import { HTTP_STATUS } from '@src/constant/http-status.constant';
import { GetSPUsRequestParamsDto } from '@src/dto/customer/spu/get-spus.dto';
import { SPUService } from '@src/services/customer/spu/spu.service';
import { NextFunction, Request, Response } from 'express';

export class SPUController {
  constructor(private readonly spuService: SPUService) {}

  getSPUs = async (
    req: Request<GetSPUsRequestParamsDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const results = await this.spuService.getSPUs(id);
      res.status(HTTP_STATUS.OK).json(results);
    } catch (error) {
      next(error);
    }
  };
}
