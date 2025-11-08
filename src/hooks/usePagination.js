import axios from '@/libs/axios';
import { useState, useEffect } from 'react';

export const usePagination = ({
  initialPage = 1,
  pageSize = 10,
  apiUrl,
  params = {},
} ) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPage = async (pageNumber = page) => {
    setLoading(true);
    setError('');
    try {
      const { data: res } = await axios.get(apiUrl, {
        params: { page: pageNumber, pageSize, ...params },
      });
      setData(res.list);
      setTotal(res.total);
      setPage(pageNumber);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchPage(initialPage);
  }, [initialPage]);

  return {
    data,
    total,
    page,
    pageSize,
    loading,
    error,
    setPage: fetchPage, 
    refetch: () => fetchPage(page),
  };
};
