import React from 'react';
import Layout from './Layout';
import "./Home.css";

const Home = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Layout>
            <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">A Proof of Concept</h2>
                    <p className="text-lg">
                        Originally designed for junior hockey teams, this project is currently a <strong>proof of concept</strong> 
                        that analyzes <strong>NHL player performance</strong>. While it does not provide real-time statistics, it 
                        evaluates players based on a range of factors, generating a <strong>performance rating</strong> and 
                        making all data accessible to <strong>players, coaches, and team staff</strong>.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">How It Works</h2>
                    <p className="text-lg">
                        Our system takes detailed <strong>NHL player data</strong> and analyzes various aspects of their game, 
                        including:
                    </p>
                    <ul className="list-disc ml-6 text-lg">
                        <li>Scoring efficiency relative to ice time</li>
                        <li>Offensive vs. defensive impact</li>
                        <li>Contribution in different game situations (power play, penalty kill, etc.)</li>
                        <li>Comparisons to similar players based on historical data</li>
                    </ul>
                    <p className="text-lg mt-4">
                        Using this analysis, we assign players a <strong>performance rating</strong> that gives deeper insight 
                        beyond traditional stats like goals and assists.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Who Can Use This?</h2>
                    <p className="text-lg">
                        Our platform allows <strong>players, coaches, and staff</strong> to access performance insights, helping:
                    </p>
                    <ul className="list-disc ml-6 text-lg">
                        <li>Coaches identify strengths and weaknesses in their lineup</li>
                        <li>Players compare themselves to peers</li>
                        <li>Teams make data-driven lineup decisions</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">The Future of This Project</h2>
                    <p className="text-lg">
                        While our current system only works with NHL data, the long-term goal remains the same: 
                        bringing advanced analytics to <strong>junior, semi-pro, and amateur hockey teams</strong>. Future iterations 
                        will explore how to adapt these insights for lower levels of play, making hockey analytics <strong>more accessible for everyone</strong>.
                    </p>
                </section>

                <div className="text-center mt-10">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Stay tuned as we continue refining "What The Puck!?" 🚀
                    </h3>
                </div>
            </div>
            </Layout>
        </div>
    );
};

export default Home;
