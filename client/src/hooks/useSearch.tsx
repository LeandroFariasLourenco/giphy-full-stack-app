import { useState } from "react";
import { Giphy } from "../clients";
import { SearchResponse } from "../models";

interface HookProps {
  initialPage: number;
  defaultItemsPerPage: number;
}

const useSearch = ({
  initialPage = 1,
  defaultItemsPerPage = 10,
}: HookProps) => {
  const [searchResult, setSearchResult] = useState<SearchResponse>();
  const [currentTerm, setCurrentTerm] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(defaultItemsPerPage);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchResults = async (query: string = '', page: number = currentPage) => {
    try {
      setLoading(true);
      console.log(page);
      console.log(itemsPerPage);
      const { data: searchResults } = await Giphy.get<SearchResponse>(`/search`, {
        params: {
          q: query,
          offset: itemsPerPage * (page - 1),
          limit: itemsPerPage,
        }
      });
      setSearchResult(searchResults);
      setCurrentTerm(query);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchResult,
    loading,
    fetchResults,
    currentPage,
    setCurrentPage,
    setItemsPerPage,
    currentTerm,
    itemsPerPage,
  };
};

export default useSearch;
