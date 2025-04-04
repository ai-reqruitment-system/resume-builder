const ColorPicker = ({ selectedColor, onColorChange }) => {
    const colors = [
        { hex: '#FFFFFF', label: 'White' },
        { hex: '#4B4B4B', label: 'Dark Gray' },
        { hex: '#B4A69B', label: 'Taupe' },
        { hex: '#1E4D8C', label: 'Navy Blue' },
        { hex: '#4B83DB', label: 'Blue' },
        { hex: '#5BC3EB', label: 'Light Blue' },
        { hex: '#3D8477', label: 'Teal' },
        { hex: '#F4A261', label: 'Orange' },
        { hex: '#E76F51', label: 'Coral' }
    ];

    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-2">
                {colors.map((color) => (
                    <button
                        key={color.hex}
                        onClick={() => onColorChange(color.hex)}
                        className={`w-8 h-8 rounded-full transition-transform duration-200 hover:scale-110 relative
              ${selectedColor === color.hex ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
              ${color.hex === '#FFFFFF' ? 'border border-gray-200' : ''}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.label}
                    >
                        {selectedColor === color.hex && (
                            <span className="absolute inset-0 flex items-center justify-center">
                {color.hex === '#FFFFFF' && (
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
                                {color.hex !== '#FFFFFF' && (
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
              </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default ColorPicker;