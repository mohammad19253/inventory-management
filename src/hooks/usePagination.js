import { useState } from "react";

export const usePagination = ({
  initialPage = 1,
  pageSize = 10,
  totalItems = 0,
  
}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSizeCount, setPageSize] = useState(pageSize);
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    pageSize:pageSizeCount,
    totalPages,
    setPage,
    setPageSize,
  };
};
