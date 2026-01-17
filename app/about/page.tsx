import Link from 'next/link'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-gray-900 mb-8">About Technidy</h1>

                <div className="prose prose-lg text-gray-600 space-y-6">
                    <p>
                        Welcome to <strong>Technidy</strong>, your premier destination for the latest in artificial intelligence, technology trends, and digital innovation. Our mission is to bridge the gap between complex technological breakthroughs and everyday understanding.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12">Our Vision</h2>
                    <p>
                        We believe that AI is not just a tool, but a transformative force that will redefine how we live, work, and interact with the world. We strive to provide in-depth analysis, expert insights, and clear explanations of the technologies shaping our future.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12">What We Cover</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Machine Learning & Neural Networks</li>
                        <li>Robotics and Automation</li>
                        <li>AI Ethics and Governance</li>
                        <li>Future Tech Trends</li>
                        <li>Digital Transformation Strategies</li>
                    </ul>

                    <div className="mt-16 p-8 bg-blue-600 rounded-3xl text-white">
                        <h3 className="text-2xl font-bold mb-4 text-white">Join Our Journey</h3>
                        <p className="mb-6">Stay ahead of the curve with our daily insights. Subscribe to our newsletter to get the most important AI news delivered straight to your inbox.</p>
                        <Link href="/" className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition">
                            Explore Our Stories
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
