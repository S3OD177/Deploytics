
export interface FeatureIdea {
    id: string;
    title: string;
    category: 'AI' | 'Security' | 'DevOps' | 'Analytics' | 'Collaboration' | 'Mobile' | 'Blockchain' | 'IoT';
    description: string;
    status: 'planned' | 'in-progress' | 'beta' | 'live';
    votes: number;
    impact: 'High' | 'Medium' | 'Low';
}

export const featuresList: FeatureIdea[] = [
    // --- AI & Intelligence ---
    { id: 'ai-1', title: 'Predictive Auto-Scaling', category: 'AI', description: 'AI predicts traffic spikes and pre-warms containers 5 mins before.', status: 'beta', votes: 1250, impact: 'High' },
    { id: 'ai-2', title: 'Natural Language Querying', category: 'AI', description: 'Ask "Why did my deploy fail?" and get a plain English answer.', status: 'planned', votes: 980, impact: 'High' },
    { id: 'ai-3', title: 'Code Review Bot', category: 'AI', description: 'Automated PR comments for performance and security smells.', status: 'live', votes: 850, impact: 'Medium' },
    { id: 'ai-4', title: 'Self-Healing Infrastructure', category: 'AI', description: 'Automatically restart or rollback unhealthy services.', status: 'planned', votes: 2100, impact: 'High' },
    { id: 'ai-5', title: 'Voice Ops Command', category: 'AI', description: 'Control deployments via voice commands ("Deploy to prod, now").', status: 'planned', votes: 320, impact: 'Low' },
    // ... (Simulating 500 items via categories for the demo)
    { id: 'ai-6', title: 'Sentiment Analysis for Logs', category: 'AI', description: 'Detect user frustration patterns in error logs.', status: 'planned', votes: 450, impact: 'Medium' },
    { id: 'ai-7', title: 'Generative UI Builder', category: 'AI', description: 'Describe a page, get React code generated instantly.', status: 'in-progress', votes: 3500, impact: 'High' },

    // --- Security & Privacy ---
    { id: 'sec-1', title: 'Quantum-Safe Encryption', category: 'Security', description: 'Prepare for the post-quantum era with lattice-based crypto.', status: 'planned', votes: 600, impact: 'High' },
    { id: 'sec-2', title: 'Biometric sudo', category: 'Security', description: 'Require FaceID/TouchID for critical production deployments.', status: 'planned', votes: 890, impact: 'Medium' },
    { id: 'sec-3', title: 'Honeypot Deployments', category: 'Security', description: 'Deploy fake services to trap and analyze attackers.', status: 'beta', votes: 1100, impact: 'High' },
    { id: 'sec-4', title: 'GDPR Auto-Redaction', category: 'Security', description: 'Automatically mask PII in logs and databases.', status: 'live', votes: 1500, impact: 'High' },

    // --- DevOps & Scale ---
    { id: 'dev-1', title: 'Multi-Cloud Mesh', category: 'DevOps', description: 'Seamlessly run one service across AWS, Vercel, and Azure.', status: 'planned', votes: 1300, impact: 'High' },
    { id: 'dev-2', title: 'Chaos Monkey as a Service', category: 'DevOps', description: 'Randomly kill pods to test resilience (configurable).', status: 'planned', votes: 950, impact: 'Medium' },
    { id: 'dev-3', title: 'Instant Rollback', category: 'DevOps', description: 'Revert to previous version in < 100ms.', status: 'live', votes: 2000, impact: 'High' },
    { id: 'dev-4', title: 'Edge SQL Caching', category: 'DevOps', description: 'Cache SQL results at the edge for 10x faster reads.', status: 'beta', votes: 1700, impact: 'High' },

    // --- Analytics & Observations ---
    { id: 'ana-1', title: '3D Traffic Globe', category: 'Analytics', description: 'Visualize request origins on a WebGL globe.', status: 'live', votes: 800, impact: 'Low' },
    { id: 'ana-2', title: 'Competitor Benchmarking', category: 'Analytics', description: 'Compare your TTFB and SEO scores against competitors.', status: 'planned', votes: 1400, impact: 'Medium' },
    { id: 'ana-3', title: 'Revenue Correlation', category: 'Analytics', description: 'See how latency directly affects your Stripe MRR.', status: 'in-progress', votes: 2200, impact: 'High' },

    // --- Collaboration ---
    { id: 'col-1', title: 'Multiplayer Terminal', category: 'Collaboration', description: 'Google Docs style collaboration for SSH sessions.', status: 'planned', votes: 1050, impact: 'Medium' },
    { id: 'col-2', title: 'VR War Room', category: 'Collaboration', description: 'Oculus app for investigating major outages.', status: 'planned', votes: 150, impact: 'Low' },

    // --- Mobile ---
    { id: 'mob-1', title: 'iOS Widget', category: 'Mobile', description: 'Home screen widget for deployment status.', status: 'beta', votes: 1600, impact: 'Medium' },
    { id: 'mob-2', title: 'Push-to-Deploy Watch App', category: 'Mobile', description: 'Deploy from your Apple Watch.', status: 'planned', votes: 400, impact: 'Low' },

    // --- Blockchain / Web3 ---
    { id: 'blk-1', title: 'NFT Certificates', category: 'Blockchain', description: 'Mint an NFT for every successful major release.', status: 'planned', votes: 50, impact: 'Low' },
    { id: 'blk-2', title: 'DAO Governance', category: 'Blockchain', description: 'Let token holders vote on feature roadmap priorities.', status: 'planned', votes: 200, impact: 'Medium' },

    // --- IoT ---
    { id: 'iot-1', title: 'Raspberry Pi Cluster Agent', category: 'IoT', description: 'Manage your home lab K3s cluster alongside cloud.', status: 'planned', votes: 1800, impact: 'High' },
    { id: 'iot-2', title: 'Physical Status Light', category: 'IoT', description: 'Phillips Hue integration: Red for error, Green for success.', status: 'beta', votes: 750, impact: 'Low' },
];

// Helper to generate "Infinite" ideas
export const generateInfiniteFeatures = () => {
    const prefixes = ["Auto", "Smart", "Quantum", "Distributed", "Serverless", "Edge", "AI-Powered", "Real-time", "Encrypted"];
    const nouns = ["Database", "Cache", "Load Balancer", "CDN", "Firewall", "Router", "Container", "Function", "Gateway"];
    const suffixes = ["Optimizer", "Scaler", "Shield", "Analyzer", "Monitor", "Visualizer", "Deployer", "Debugger"];

    const extraFeatures: FeatureIdea[] = [];

    for (let i = 0; i < 480; i++) {
        const p = prefixes[Math.floor(Math.random() * prefixes.length)];
        const n = nouns[Math.floor(Math.random() * nouns.length)];
        const s = suffixes[Math.floor(Math.random() * suffixes.length)];

        extraFeatures.push({
            id: `gen-${i}`,
            title: `${p} ${n} ${s}`,
            category: 'DevOps',
            description: `Automated ${p.toLowerCase()} solution for your ${n.toLowerCase()} infrastructure.`,
            status: Math.random() > 0.8 ? 'beta' : 'planned',
            votes: Math.floor(Math.random() * 500),
            impact: Math.random() > 0.5 ? 'Medium' : 'Low'
        });
    }
    return [...featuresList, ...extraFeatures];
};
