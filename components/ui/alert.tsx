// components/ui/alert.tsx
import React from "react";

const Alert = ({ children, variant = "default", className = "" }) => {
    const baseStyles = "p-4 mb-4 rounded-lg border";
    const variants = {
        default: "bg-blue-50 text-blue-700 border-blue-200",
        destructive: "bg-red-50 text-red-700 border-red-200",
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};

const AlertTitle = ({ children }) => (
    <h5 className="font-medium mb-1">{children}</h5>
);

const AlertDescription = ({ children }) => (
    <div className="text-sm">{children}</div>
);

export { Alert, AlertTitle, AlertDescription };