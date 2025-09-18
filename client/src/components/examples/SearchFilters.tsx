import SearchFilters from '../SearchFilters';

export default function SearchFiltersExample() {
  const handleFiltersChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  return (
    <div className="p-6">
      <SearchFilters onFiltersChange={handleFiltersChange} />
    </div>
  );
}