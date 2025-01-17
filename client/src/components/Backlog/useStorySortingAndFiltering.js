import {useState, useEffect} from 'react';
import {defaultSorting} from '../common/storySortings';

/**
 *
 * @param {object[]} stories
 * @param comparator
 * @param {string} query A optional query string
 * @return {*[]}
 */
const sortAndFilterStories = (stories, comparator, query = '') => {
  const lcQuery = query.toLowerCase();
  let shallowCopy = query
    ? [...stories.filter((s) => s.title.toLowerCase().includes(lcQuery))]
    : [...stories];
  return shallowCopy.sort(comparator);
};

/**
 * @param {object[]} stories
 * @return {{setSorting, setFilterQuery, sorting, sortedStories, filterQuery}}
 */
const useStorySortingAndFiltering = (stories) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [sorting, setSorting] = useState(defaultSorting);
  const [sortedStories, setSortedStories] = useState(stories);
  useEffect(() => {
    setSortedStories(sortAndFilterStories(stories, sorting.comp, filterQuery));
  }, [stories, sorting, filterQuery]);

  return {filterQuery, setFilterQuery, sorting, setSorting, sortedStories, setSortedStories};
};

export default useStorySortingAndFiltering;
