import React from 'react';
import { X } from 'lucide-react';

 const GenericModal = ({ onClose, title, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-2xl p-2 rounded-lg shadow-lg relative">

        <div className="bg-[#345246] text-white p-4 rounded-t-lg flex justify-between items-center mt-[-20px] m-[-9px] mb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none">
            <X size={30} />
          </button> 
        </div>

        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default GenericModal