const FormField = ({ label, type = "text", value, onChange, placeholder, required = false, className = "", defaultValue }) => (

    <div className="relative">
        <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs sm:text-sm text-gray-600">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            defaultValue={defaultValue}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out mt-1 text-sm sm:text-base ${className}`}
            required={required}
        />
    </div>
);
export default FormField;