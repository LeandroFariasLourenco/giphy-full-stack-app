import { Meta } from "./meta.interface";
import { Pagination } from "./pagination.interface";
import { SearchResult } from "./search-result.interface";

export interface SearchResponse {
  data: SearchResult[];
  pagination: Pagination;
  meta: Meta;
}
