export default function Unauthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">401 Unauthorized</h1>
                <p>You are not authorized to access this page</p>
            </div>
        </div>
    )
}