import React, { useEffect } from 'react';
import { X, Check, CreditCard } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose }) => {
    // Debug log to verify the modal is receiving the correct props
    useEffect(() => {
        console.log('PaymentModal isOpen:', isOpen);
        if (isOpen) {
            console.log('%c PAYMENT MODAL IS OPEN! ', 'background: #ff0000; color: #ffffff; font-size: 20px;');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const plans = [
        {
            name: 'Basic',
            price: '$9.99',
            period: 'month',
            features: [
                'Download up to 3 resumes',
                'Access to basic templates',
                'PDF downloads',
                'Email support'
            ],
            recommended: false,
            buttonClass: 'bg-gray-700 hover:bg-gray-800'
        },
        {
            name: 'Pro',
            price: '$19.99',
            period: 'month',
            features: [
                'Unlimited resume downloads',
                'Access to all templates',
                'PDF & DOCX downloads',
                'Priority email support',
                'Remove watermark',
                'Cover letter builder'
            ],
            recommended: true,
            buttonClass: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            name: 'Enterprise',
            price: '$49.99',
            period: 'month',
            features: [
                'Everything in Pro plan',
                'Custom branding',
                'Team collaboration',
                'API access',
                'Dedicated account manager',
                'Phone support'
            ],
            recommended: false,
            buttonClass: 'bg-gray-700 hover:bg-gray-800'
        }
    ];

    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 mx-auto overflow-y-auto">
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl mx-auto my-8 max-h-[90vh] overflow-y-auto">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="px-10 py-4 text-center border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Upgrade to Download</h2>
                        <p className="text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed">
                            Get access to premium features and unlimited downloads with our subscription plans.
                        </p>
                    </div>

                    {/* Plans */}
                    <div className="px-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className={`relative rounded-lg border-2 bg-white transition-all duration-200 ${plan.recommended
                                        ? 'border-blue-500 shadow-lg'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {/* Recommended badge */}
                                    {plan.recommended && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="inline-block px-4 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    {/* Plan content */}
                                    <div className="p-8">
                                        {/* Plan header */}
                                        <div className="text-center mb-8">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{plan.name}</h3>
                                            <div className="flex items-center justify-center mb-6">
                                                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                                                <span className="text-gray-500 ml-2 text-base">/{plan.period}</span>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="mb-8">
                                            <ul className="space-y-4">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start">
                                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mr-3 mt-0.5" />
                                                        <span className="text-gray-700 text-xs leading-relaxed">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* CTA Button */}
                                        <button
                                            className={`w-full ${plan.buttonClass} text-white py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium`}
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            <span>Subscribe Now</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-10 py-6 bg-gray-50 border-t border-gray-200 text-center rounded-b-lg">
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            All plans include a 7-day free trial. Cancel anytime.
                        </p>
                        <button
                            onClick={onClose}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                            <span>Continue with free version</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;