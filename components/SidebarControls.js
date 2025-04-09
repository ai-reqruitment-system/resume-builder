import { useState } from 'react';
import { FaBold, FaFont, FaItalic } from "react-icons/fa";
<<<<<<< HEAD
// Import Redux hooks
import { useSelector, useDispatch } from 'react-redux';
import { updateFontStyle } from '@/store/slices/templateSlice';
=======
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935

const fontOptions = [
    "sans-serif", "serif", "monospace", "Arial", "Verdana",
    "Georgia", "Tahoma", "Trebuchet MS", "Times New Roman",
    "Courier New", "Comic Sans MS", "Lucida Console",
];

const colorOptions = [
    "#000000", // Black
    "#6B7280", // Gray
    "#1E40AF", // Dark Blue
    "#4F46E5", // Blue
    "#7DD3FC", // Light Blue
    "#047857", // Green
    "#FB923C", // Orange
    "#E11D48", // Red
];

<<<<<<< HEAD
export default function SidebarControls({ fontStyles: propFontStyles, updateFontStyles: propUpdateFontStyles }) {
    const dispatch = useDispatch();
    // Get font styles from Redux store if not provided as props
    const reduxFontStyles = useSelector(state => state.template.fontStyles);

    // Use prop values if provided (for backward compatibility), otherwise use Redux state
    const fontStyles = propFontStyles || reduxFontStyles;

    const [fontDropdownOpen, setFontDropdownOpen] = useState(false);

    // Function to update font styles
    const updateFontStyles = (newStyles) => {
        // Update Redux state
        dispatch(updateFontStyle(newStyles));

        // For backward compatibility, also call the prop function if provided
        if (propUpdateFontStyles) {
            propUpdateFontStyles(newStyles);
        }
    };

=======
export default function SidebarControls({ fontStyles, updateFontStyles }) {
    const [fontDropdownOpen, setFontDropdownOpen] = useState(false);

>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
    return (
        <div className="space-y-6">
            {/* Font Family */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Font</label>
                <div className="relative">
                    <button
                        className="w-full border border-gray-300 rounded p-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                    >
                        <span style={{ fontFamily: fontStyles.font_family }}>
                            {fontStyles.font_family}
                        </span>
                        <FaFont className="text-gray-400" />
                    </button>
                    {fontDropdownOpen && (
                        <div className="absolute left-0 w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                            {fontOptions.map((font) => (
                                <button
                                    key={font}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                                    style={{ fontFamily: font }}
                                    onClick={() => {
                                        updateFontStyles({ font_family: font });
                                        setFontDropdownOpen(false);
                                    }}
                                >
                                    {font}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Font Style */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Style</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => updateFontStyles({ is_font_bold: !fontStyles.is_font_bold })}
<<<<<<< HEAD
                        className={`flex-1 p-2 rounded-lg transition-colors ${fontStyles.is_font_bold ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
=======
                        className={`flex-1 p-2 rounded-lg transition-colors ${
                            fontStyles.is_font_bold ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                    >
                        <FaBold />
                    </button>
                    <button
                        onClick={() => updateFontStyles({ is_font_italic: !fontStyles.is_font_italic })}
<<<<<<< HEAD
                        className={`flex-1 p-2 rounded-lg transition-colors ${fontStyles.is_font_italic ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
=======
                        className={`flex-1 p-2 rounded-lg transition-colors ${
                            fontStyles.is_font_italic ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                    >
                        <FaItalic />
                    </button>
                </div>
            </div>

            {/* Colors */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Colors</label>
                <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                        <button
                            key={color}
                            onClick={() => updateFontStyles({ font_color: color })}
                            className="aspect-square p-1 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                            title={color}
                        >
                            <div
<<<<<<< HEAD
                                className={`w-full h-full rounded-full border transition-all ${fontStyles.font_color === color
                                        ? 'ring-2 ring-offset-2 ring-blue-500 scale-90'
                                        : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300 hover:scale-90'
                                    }`}
=======
                                className={`w-full h-full rounded-full border transition-all ${
                                    fontStyles.font_color === color
                                        ? 'ring-2 ring-offset-2 ring-blue-500 scale-90'
                                        : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300 hover:scale-90'
                                }`}
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                                style={{ backgroundColor: color }}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}