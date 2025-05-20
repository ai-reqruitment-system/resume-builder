const TabButton = ({ isActive, icon: Icon, label, onClick }) => (
    <button
        className={`flex items-center gap-1.5 py-2 px-3 text-sm font-medium border-b-2 transition-colors ${
            isActive
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        onClick={onClick}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);
export default TabButton;
