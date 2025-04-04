import {ChevronDown,Trash2} from 'lucide-react';

const ContentItem = ({
                         title,
                         isActive,
                         canDelete,
                         onDelete,
                         onClick,
                         children
                     }) => (
    <div className="border border-gray-200 rounded-md overflow-hidden">
        <div
            onClick={onClick}
            className="w-full flex items-center justify-between p-3 bg-gray-50
                hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
        >
            <span className="font-medium text-sm text-gray-700">
                {title}
            </span>
            <div className="flex items-center space-x-2">
                {canDelete && (
                    <div
                        onClick={onDelete}
                        className="p-1 text-gray-400 hover:text-red-500
                            hover:bg-red-50 rounded-full transition-colors duration-200"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </div>
                )}
                <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200
                        ${isActive ? 'rotate-180' : ''}`}
                />
            </div>
        </div>
        <div className={`transition-all duration-200 ease-in-out
            ${isActive ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
            overflow-hidden`}
        >
            {children}
        </div>
    </div>
);
export default ContentItem;