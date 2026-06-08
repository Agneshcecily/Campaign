'use client';

import { useRef, useEffect } from 'react';

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  position?: 'right' | 'left';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  position = 'right' 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleEdit = () => {
    onClose();
    onEdit && onEdit();
  };

  const handleDelete = () => {
    onClose();
    onDelete && onDelete();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className={`absolute top-full mt-1 w-28 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 ${
        position === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      <button
        onClick={handleEdit}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-150 flex items-center"
      >
       
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="w-full px-4 py-2 text-left text-sm text-black-600 hover:bg-red-200 transition-colors duration-150 flex items-center"
      >
        
        Delete
      </button>
    </div>
  );
};

export default DropdownMenu;