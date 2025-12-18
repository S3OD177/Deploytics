export interface IntegrationDefinition {
    id: string;
    name: string;
    category: 'Cloud' | 'Source Control' | 'CI/CD' | 'Monitoring' | 'Communication' | 'Project Management' | 'Feature Flags' | 'Analytics' | 'Security';
    description: string;
    icon: string;
    status: 'available' | 'coming_soon' | 'beta';

    // Detailed configuration
    steps?: string[];
    fetchOptions?: { id: string; label: string; description: string; default: boolean; }[];
    color?: string;
    bgColor?: string;
    placeholder?: string;
    docsUrl?: string;
    fieldName?: string;
}

export const integrationDefinitions: IntegrationDefinition[] = [
    // --- Cloud Providers ---
    {
        id: 'vercel',
        name: 'Vercel',
        category: 'Cloud',
        description: 'Develop. Preview. Ship.',
        icon: 'Triangle',
        status: 'available',
        color: "text-black dark:text-white",
        bgColor: "bg-white dark:bg-black",
        docsUrl: "https://vercel.com/account/tokens",
        placeholder: "xxxxxxxxxxxxxxxx",
        fieldName: "access_token",
        fetchOptions: [
            { id: "deployments", label: "Deployments", description: "Status, duration, and commit info", default: true },
            { id: "domains", label: "Domains", description: "DNS configuration and SSL status", default: true },
            { id: "logs", label: "Build Logs", description: "Error logs and build output", default: false },
            { id: "analytics", label: "Web Vitals", description: "Real-time performance metrics", default: false },
        ],
        steps: [
            "Navigate to Vercel Account Settings",
            "Go to the 'Tokens' section",
            "Create a new token with 'Full Access'",
            "Copy the token secret"
        ]
    },
    {
        id: 'aws',
        name: 'AWS',
        category: 'Cloud',
        description: 'Deploy and monitor AWS resources.',
        icon: 'Cloud',
        status: 'coming_soon',
        color: "text-[#FF9900]",
        bgColor: "bg-[#232F3E]",
        docsUrl: "https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html",
        placeholder: "Access Key ID",
        steps: ["Go to IAM Console", "Create Access Key", "Enter Access Key ID"]
    },
    { id: 'azure', name: 'Azure', category: 'Cloud', description: 'Integration with Azure DevOps and Cloud.', icon: 'Cloud', status: 'coming_soon', color: "text-[#0078D4]", bgColor: "bg-[#1e1e1e]" },
    { id: 'gcp', name: 'Google Cloud', category: 'Cloud', description: 'GCP deployment tracking.', icon: 'Cloud', status: 'coming_soon', color: "text-[#4285F4]", bgColor: "bg-white" },
    { id: 'digitalocean', name: 'DigitalOcean', category: 'Cloud', description: 'App Platform and Droplet monitoring.', icon: 'Cloud', status: 'coming_soon', color: "text-[#0080FF]", bgColor: "bg-white" },
    { id: 'heroku', name: 'Heroku', category: 'Cloud', description: 'Heroku Dyno and build tracking.', icon: 'Cloud', status: 'coming_soon', color: "text-[#430098]", bgColor: "bg-white" },
    { id: 'fly', name: 'Fly.io', category: 'Cloud', description: 'Global application platform.', icon: 'Cloud', status: 'coming_soon', color: "text-[#24185B]", bgColor: "bg-white" },
    { id: 'render', name: 'Render', category: 'Cloud', description: 'Unified cloud to build and run apps.', icon: 'Render', status: 'coming_soon', color: "text-blue-400", bgColor: "bg-blue-950" },
    { id: 'railway', name: 'Railway', category: 'Cloud', description: 'Infrastructure made simple.', icon: 'Railway', status: 'coming_soon', color: "text-purple-400", bgColor: "bg-purple-950" },
    { id: 'netlify', name: 'Netlify', category: 'Cloud', description: 'Web development platform.', icon: 'Netlify', status: 'coming_soon', color: "text-teal-400", bgColor: "bg-teal-950" },

    // --- Source Control ---
    {
        id: 'github',
        name: 'GitHub',
        category: 'Source Control',
        description: 'Source code management.',
        icon: 'Github',
        status: 'available',
        color: "text-white",
        bgColor: "bg-zinc-900",
        docsUrl: "https://github.com/settings/tokens",
        placeholder: "ghp_xxxxxxxxxxxx",
        fieldName: "access_token",
        fetchOptions: [
            { id: "repos", label: "Repositories", description: "Read-only access to metadata", default: true },
            { id: "commits", label: "Commits", description: "Sync commit history and authors", default: true },
            { id: "prs", label: "Pull Requests", description: "Track PR status and reviews", default: true },
            { id: "actions", label: "Actions", description: "Monitor workflow runs", default: true },
            { id: "issues", label: "Issues", description: "Track open issues", default: false },
        ],
        steps: [
            "Go to GitHub Settings > Developer settings",
            "Select 'Tokens (classic)'",
            "Generate new token with 'repo' scope",
            "Paste the token here"
        ]
    },
    { id: 'gitlab', name: 'GitLab', category: 'Source Control', description: 'DevSecOps platform.', icon: 'Gitlab', status: 'coming_soon', color: "text-[#FC6D26]", bgColor: "bg-[#292961]" },
    { id: 'bitbucket', name: 'Bitbucket', category: 'Source Control', description: 'Git solution for teams.', icon: 'GitBranch', status: 'coming_soon', color: "text-[#0052CC]", bgColor: "bg-[#DEEBFF]" },

    // --- CI/CD ---
    { id: 'circleci', name: 'CircleCI', category: 'CI/CD', description: 'Continuous integration and delivery.', icon: 'Circle', status: 'coming_soon', color: "text-white", bgColor: "bg-[#343434]" },
    { id: 'travis', name: 'Travis CI', category: 'CI/CD', description: 'Test and Deploy with confidence.', icon: 'Settings', status: 'coming_soon', color: "text-[#CB333B]", bgColor: "bg-white" },
    { id: 'jenkins', name: 'Jenkins', category: 'CI/CD', description: 'Open source automation server.', icon: 'Settings', status: 'coming_soon', color: "text-[#D33833]", bgColor: "bg-white" },
    { id: 'github_actions', name: 'GitHub Actions', category: 'CI/CD', description: 'Automate your workflow.', icon: 'Play', status: 'coming_soon', color: "text-white", bgColor: "bg-[#2088FF]" },

    // --- Monitoring ---
    { id: 'datadog', name: 'Datadog', category: 'Monitoring', description: 'Cloud monitoring as a service.', icon: 'Activity', status: 'coming_soon', color: "text-[#632CA6]", bgColor: "bg-white" },
    { id: 'newrelic', name: 'New Relic', category: 'Monitoring', description: 'Observability platform.', icon: 'Activity', status: 'coming_soon', color: "text-[#008C99]", bgColor: "bg-white" },
    { id: 'sentry', name: 'Sentry', category: 'Monitoring', description: 'Application monitoring and error tracking.', icon: 'AlertTriangle', status: 'coming_soon', color: "text-[#362D59]", bgColor: "bg-white" },
    { id: 'logrocket', name: 'LogRocket', category: 'Monitoring', description: 'Session replay and error tracking.', icon: 'Eye', status: 'coming_soon', color: "text-[#764ABC]", bgColor: "bg-white" },
    { id: 'grafana', name: 'Grafana', category: 'Monitoring', description: 'Operational dashboards.', icon: 'Activity', status: 'coming_soon', color: "text-[#F46800]", bgColor: "bg-white" },
    { id: 'prometheus', name: 'Prometheus', category: 'Monitoring', description: 'Monitoring system.', icon: 'Activity', status: 'coming_soon', color: "text-[#E6522C]", bgColor: "bg-white" },
    { id: 'splunk', name: 'Splunk', category: 'Monitoring', description: 'Data-to-Everything Platform.', icon: 'Search', status: 'coming_soon', color: "text-[#000000]", bgColor: "bg-[#CE0000]" },

    // --- Communication ---
    { id: 'slack', name: 'Slack', category: 'Communication', description: 'Team communication.', icon: 'Slack', status: 'available', color: "text-white", bgColor: "bg-[#4A154B]" },
    { id: 'discord', name: 'Discord', category: 'Communication', description: 'Chat for communities.', icon: 'MessageSquare', status: 'available', color: "text-white", bgColor: "bg-[#5865F2]" },
    { id: 'msteams', name: 'Microsoft Teams', category: 'Communication', description: 'Workspace for real-time collaboration.', icon: 'MessageSquare', status: 'coming_soon', color: "text-[#6264A7]", bgColor: "bg-white" },
    { id: 'email', name: 'Email', category: 'Communication', description: 'Traditional email notifications.', icon: 'Mail', status: 'available', color: "text-gray-500", bgColor: "bg-white" },
    { id: 'twilio', name: 'Twilio', category: 'Communication', description: 'SMS and voice notifications.', icon: 'Phone', status: 'coming_soon', color: "text-[#F22F46]", bgColor: "bg-white" },

    // --- Project Management ---
    { id: 'jira', name: 'Jira', category: 'Project Management', description: 'Issue and project tracking.', icon: 'Trello', status: 'coming_soon', color: "text-[#0052CC]", bgColor: "bg-white" },
    { id: 'linear', name: 'Linear', category: 'Project Management', description: 'Issue tracking built for speed.', icon: 'Zap', status: 'coming_soon', color: "text-white", bgColor: "bg-[#5E6AD2]" },
    { id: 'asana', name: 'Asana', category: 'Project Management', description: 'Work management platform.', icon: 'CheckSquare', status: 'coming_soon', color: "text-[#F06A6A]", bgColor: "bg-white" },
    { id: 'trello', name: 'Trello', category: 'Project Management', description: 'Collaborative tool for projects.', icon: 'Trello', status: 'coming_soon', color: "text-[#0079BF]", bgColor: "bg-white" },
    { id: 'notion', name: 'Notion', category: 'Project Management', description: 'All-in-one workspace.', icon: 'FileText', status: 'coming_soon', color: "text-black dark:text-white", bgColor: "bg-white dark:bg-black" },
    { id: 'monday', name: 'Monday.com', category: 'Project Management', description: 'Work OS.', icon: 'Calendar', status: 'coming_soon', color: "text-[#FF4A68]", bgColor: "bg-white" },
    { id: 'clickup', name: 'ClickUp', category: 'Project Management', description: 'One app to replace them all.', icon: 'CheckCircle', status: 'coming_soon', color: "text-[#7B68EE]", bgColor: "bg-white" },
    { id: 'shortcut', name: 'Shortcut', category: 'Project Management', description: 'Project management for software teams.', icon: 'List', status: 'coming_soon', color: "text-[#E63946]", bgColor: "bg-white" },
    { id: 'height', name: 'Height', category: 'Project Management', description: 'Project management tool.', icon: 'Kanban', status: 'coming_soon', color: "text-[#F4A261]", bgColor: "bg-white" },

    // --- Database ---
    {
        id: 'supabase',
        name: 'Supabase',
        category: 'Cloud', // Or Database
        description: 'Track your database health.',
        icon: 'Supabase',
        status: 'available',
        color: "text-emerald-400",
        bgColor: "bg-emerald-950",
        docsUrl: "https://supabase.com/dashboard/account/tokens",
        placeholder: "sbp_xxxxxxxxxxxx",
        fieldName: "access_token",
        fetchOptions: [
            { id: "database", label: "Database Health", description: "Size, connections", default: true },
            { id: "auth", label: "Auth Stats", description: "Active users", default: true },
        ],
        steps: ["Go to Supabase > Settings > Access Tokens", "Create Token", "Copy Token"]
    },

    // --- Feature Flags ---
    { id: 'launchdarkly', name: 'LaunchDarkly', category: 'Feature Flags', description: 'Feature management platform.', icon: 'Flag', status: 'coming_soon', color: "text-[#405BFF]", bgColor: "bg-[#1E1E1E]" },
    { id: 'split', name: 'Split.io', category: 'Feature Flags', description: 'Feature delivery platform.', icon: 'GitMerge', status: 'coming_soon', color: "text-[#00C7B7]", bgColor: "bg-white" },
    { id: 'optimizely', name: 'Optimizely', category: 'Feature Flags', description: 'Digital experience platform.', icon: 'Experiment', status: 'coming_soon', color: "text-[#0037FF]", bgColor: "bg-white" },
    { id: 'configcat', name: 'ConfigCat', category: 'Feature Flags', description: 'Feature flag service.', icon: 'ToggleRight', status: 'coming_soon', color: "text-[#3D9970]", bgColor: "bg-white" },

    // --- Analytics ---
    { id: 'mixpanel', name: 'Mixpanel', category: 'Analytics', description: 'Product analytics.', icon: 'BarChart', status: 'coming_soon', color: "text-[#7856FF]", bgColor: "bg-[#1E1E1E]" },
    { id: 'amplitude', name: 'Amplitude', category: 'Analytics', description: 'Digital optimization.', icon: 'TrendingUp', status: 'coming_soon', color: "text-[#246BFD]", bgColor: "bg-white" },
    { id: 'google_analytics', name: 'Google Analytics', category: 'Analytics', description: 'Web analytics service.', icon: 'PieChart', status: 'coming_soon', color: "text-[#F4B400]", bgColor: "bg-white" },
    { id: 'heap', name: 'Heap', category: 'Analytics', description: 'Product analytics.', icon: 'BarChart2', status: 'coming_soon', color: "text-[#28A745]", bgColor: "bg-white" },

    // --- Security ---
    { id: 'snyk', name: 'Snyk', category: 'Security', description: 'Developer security platform.', icon: 'Shield', status: 'coming_soon', color: "text-[#4C4A73]", bgColor: "bg-white" },
    { id: 'auth0', name: 'Auth0', category: 'Security', description: 'Authentication and authorization.', icon: 'Lock', status: 'coming_soon', color: "text-[#EB5424]", bgColor: "bg-white" },
    { id: '1password', name: '1Password', category: 'Security', description: 'Password management.', icon: 'Key', status: 'coming_soon', color: "text-[#0094F5]", bgColor: "bg-white" },
];
