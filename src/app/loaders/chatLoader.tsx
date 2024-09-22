// PulseLoader.tsx
import React from 'react';

const PulseLoader: React.FC = () => {
    return (
        <div className="flex flex-col space-y-2 p-4">
            <div className="flex justify-end">
                <div className="animate-pulse bg-gray-300 rounded-tl-xl rounded-tr-xl rounded-bl-xl w-1/2 h-20 mb-1"></div>
            </div>
            <div className="flex justify-end">
                <div className="animate-pulse bg-gray-300 rounded-tl-xl rounded-tr-xl rounded-bl-xl w-1/6 h-16 mb-1"></div>
            </div>
            <div className="flex justify-start">
                <div className="animate-pulse bg-gray-300 rounded-tl-xl rounded-tr-xl rounded-br-xl w-1/4 h-12 mb-1"></div>
            </div>
            <div className="flex justify-end">
                <div className="animate-pulse bg-gray-300 rounded-tl-xl rounded-tr-xl rounded-bl-xl w-1/3 h-32 mb-1"></div>
            </div>
            <div className="flex justify-start">
                <div className="animate-pulse bg-gray-300 rounded-tl-xl rounded-tr-xl rounded-br-xl w-1/2 h-32 mb-1"></div>
            </div>
        </div>
    );
};

export default PulseLoader;
