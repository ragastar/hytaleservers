'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  onFilterChange: (filters: {
    search?: string;
    category?: string;
    sort?: string;
  }) => void;
  categories: Array<{ slug: string; name: string }>;
}

export function FilterBar({ onFilterChange, categories }: FilterBarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortType, setSortType] = useState<string>('rating');

  const handleFilterClick = (type: 'category' | 'sort', value: string) => {
    if (type === 'category') {
      const newValue = selectedCategory === value ? '' : value;
      setSelectedCategory(newValue);
      onFilterChange({ category: newValue, sort: sortType });
    } else if (type === 'sort') {
      setSortType(value);
      onFilterChange({ category: selectedCategory, sort: value });
    }
  };

  const sortOptions = [
    { value: 'rating', label: 'По рейтингу' },
    { value: 'players', label: 'По онлайну' },
    { value: 'new', label: 'Новые' },
    { value: 'votes', label: 'По голосам' },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Категории */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!selectedCategory ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterClick('category', '')}
        >
          Все
        </Button>
        {categories.map((category) => (
          <Button
            key={category.slug}
            variant={selectedCategory === category.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterClick('category', category.slug)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Сортировка */}
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={sortType === option.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleFilterClick('sort', option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
