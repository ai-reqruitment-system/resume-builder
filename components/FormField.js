<<<<<<< HEAD
const FormField = ({ label, type = "text", value, onChange, placeholder, required = false, className = "" }) => (
    <div className="relative">
        <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs sm:text-sm text-gray-600">
=======
const FormField = ({ label, type = "text", value, onChange, placeholder, required = false }) => (
    <div className="relative">
        <label className="absolute -top-2.5 left-2 bg-white px-1 text-sm text-gray-600">
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
<<<<<<< HEAD
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out mt-1 text-sm sm:text-base ${className}`}
=======
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out mt-1"
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
            required={required}
        />
    </div>
);
export default FormField;