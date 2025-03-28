import { PaginationDto, PaginationResult } from '@src/dto/common/pagination.dto';

export const paginate = <T>(
  items: T[],
  totalItems: number,
  paginationDto: PaginationDto,
): PaginationResult<T> => {
  const { page = 1, limit = 10 } = paginationDto;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    meta: {
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    },
  };
};

export const getOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};
