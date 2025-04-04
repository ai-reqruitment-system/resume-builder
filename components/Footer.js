import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-gray-800 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} HireMeAI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
export default Footer;