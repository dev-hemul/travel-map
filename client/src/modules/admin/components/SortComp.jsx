import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

export default function SortComp({ field, activeField, order }) {
  if (field !== activeField) {
    return <FaSort className="ml-1 inline opacity-40" />;
  }

  return order === 'asc' ? (
    <FaSortUp className="ml-1 inline text-purple-600" />
  ) : (
    <FaSortDown className="ml-1 inline text-purple-600" />
  );
}