// app/search/page.js
import { searchPoetsAndPoems } from "../../../lib/search";
import SearchResults from "../components/SearchResults";

export default async function SearchPage({ searchParams }) {
  const { q: searchQuery } = searchParams;
  const results = await searchPoetsAndPoems(searchQuery);

  return <SearchResults query={searchQuery} results={results} />;
}
