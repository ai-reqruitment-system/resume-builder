export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Replace with your actual token logic
        const token = process.env.INTERVIEW_TOKEN || 'your-interview-service-token';
        
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get token' });
    }
}