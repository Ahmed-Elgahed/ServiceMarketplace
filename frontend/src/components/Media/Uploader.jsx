import React, { useState } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';

const MediaUploader = ({ onUpload }) => {
    const [preview, setPreview] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onUpload(file);
        }
    };

    return (
        <div className="w-full h-64 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            {preview ? (
                <>
                    <img src={preview} className="w-full h-full object-cover" />
                    <button onClick={() => setPreview(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white"><FiX /></button>
                </>
            ) : (
                <label className="flex flex-col items-center cursor-pointer">
                    <FiUploadCloud size={40} className="text-purple-500 mb-4" />
                    <span className="text-sm font-bold text-gray-500">Click to upload project media</span>
                    <input type="file" className="hidden" onChange={handleFile} accept="image/*,video/*" />
                </label>
            )}
        </div>
    );
};