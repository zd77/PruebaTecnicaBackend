import { MySqlSelect } from 'drizzle-orm/mysql-core';

export function withPagination<T extends MySqlSelect>(
  queryBuilder: T,
  page: number,
  limit: number = 10
) {
  let actualPage: number;
  if (page === 1) {
    actualPage = 0;
  } else {
    actualPage = page - 1;
  }

  return queryBuilder.limit(limit).offset(actualPage * limit);
}
