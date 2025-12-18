
export interface IntegrationDefinition {
    id: string;
    name: string;
    category: 'Cloud' | 'Source Control' | 'CI/CD' | 'Monitoring' | 'Communication' | 'Project Management' | 'Feature Flags' | 'Analytics' | 'Security';
    description: string;
    icon: string; // Using Lucide icon names or image URLs (placeholder for now)
    status: 'available' | 'coming_soon' | 'beta';

    // Optional properties for detailed view
    steps?: string[];
    fetchOptions?: { id: string; label: string; description: string; default: boolean; }[];
    color?: string;
    bgColor?: string;
    placeholder?: string;
    docsUrl?: string;
    fieldName?: string;
}

export const integrationDefinitions: IntegrationDefinition[] = [
    // Cloud Providers
    { id: 'aws', name: 'AWS', category: 'Cloud', description: 'Deploy and monitor AWS resources.', icon: 'Cloud', status: 'coming_soon' },
    { id: 'azure', name: 'Azure', category: 'Cloud', description: 'Integration with Azure DevOps and Cloud.', icon: 'Cloud', status: 'coming_soon' },
    { id: 'gcp', name: 'Google Cloud', category: 'Cloud', description: 'GCP deployment tracking.', icon: 'Cloud', status: 'coming_soon' },
    { id: 'digitalocean', name: 'DigitalOcean', category: 'Cloud', description: 'App Platform and Droplet monitoring.', icon: 'Cloud', status: 'coming_soon' },
    { id: 'heroku', name: 'Heroku', category: 'Cloud', description: 'Heroku Dyno and build tracking.', icon: 'Cloud', status: 'coming_soon' },
    { id: 'fly', name: 'Fly.io', category: 'Cloud', description: 'Global application platform.', icon: 'Cloud', status: 'coming_soon' },
    { id: 'render', name: 'Render', category: 'Cloud', description: 'Unified cloud to build and run apps.', icon: 'Cloud', status: 'coming_soon' },
    { id: 'railway', name: 'Railway', category: 'Cloud', description: 'Infrastructure made simple.', icon: 'Cloud', status: 'coming_soon' },
    { id: 'netlify', name: 'Netlify', category: 'Cloud', description: 'Web development platform.', icon: 'Cloud', status: 'coming_soon' },
    { id: 'vercel', name: 'Vercel', category: 'Cloud', description: 'Develop. Preview. Ship.', icon: 'Triangle', status: 'available' },

    // Source Control
    { id: 'github', name: 'GitHub', category: 'Source Control', description: 'Source code management.', icon: 'Github', status: 'available' },
    { id: 'gitlab', name: 'GitLab', category: 'Source Control', description: 'DevSecOps platform.', icon: 'Gitlab', status: 'coming_soon' },
    { id: 'bitbucket', name: 'Bitbucket', category: 'Source Control', description: 'Git solution for teams.', icon: 'GitBranch', status: 'coming_soon' },

    // CI/CD
    { id: 'circleci', name: 'CircleCI', category: 'CI/CD', description: 'Continuous integration and delivery.', icon: 'Circle', status: 'coming_soon' },
    { id: 'travis', name: 'Travis CI', category: 'CI/CD', description: 'Test and Deploy with confidence.', icon: 'Settings', status: 'coming_soon' },
    { id: 'jenkins', name: 'Jenkins', category: 'CI/CD', description: 'Open source automation server.', icon: 'Settings', status: 'coming_soon' },
    { id: 'github_actions', name: 'GitHub Actions', category: 'CI/CD', description: 'Automate your workflow.', icon: 'Play', status: 'coming_soon' },

    // Monitoring
    { id: 'datadog', name: 'Datadog', category: 'Monitoring', description: 'Cloud monitoring as a service.', icon: 'Activity', status: 'coming_soon' },
    { id: 'newrelic', name: 'New Relic', category: 'Monitoring', description: 'Observability platform.', icon: 'Activity', status: 'coming_soon' },
    { id: 'sentry', name: 'Sentry', category: 'Monitoring', description: 'Application monitoring and error tracking.', icon: 'AlertTriangle', status: 'coming_soon' },
    { id: 'logrocket', name: 'LogRocket', category: 'Monitoring', description: 'Session replay and error tracking.', icon: 'Eye', status: 'coming_soon' },
    { id: 'grafana', name: 'Grafana', category: 'Monitoring', description: 'Operational dashboards.', icon: 'Activity', status: 'coming_soon' },
    { id: 'prometheus', name: 'Prometheus', category: 'Monitoring', description: 'Monitoring system and time series DB.', icon: 'Activity', status: 'coming_soon' },
    { id: 'splunk', name: 'Splunk', category: 'Monitoring', description: 'Data-to-Everything Platform.', icon: 'Search', status: 'coming_soon' },

    // Communication
    { id: 'slack', name: 'Slack', category: 'Communication', description: 'Team communication.', icon: 'Slack', status: 'available' },
    { id: 'discord', name: 'Discord', category: 'Communication', description: 'Chat for communities.', icon: 'MessageSquare', status: 'available' },
    { id: 'msteams', name: 'Microsoft Teams', category: 'Communication', description: 'Workspace for real-time collaboration.', icon: 'MessageSquare', status: 'coming_soon' },
    { id: 'matrix', name: 'Matrix', category: 'Communication', description: 'Open network for secure communication.', icon: 'Hash', status: 'coming_soon' },
    { id: 'email', name: 'Email', category: 'Communication', description: 'Traditional email notifications.', icon: 'Mail', status: 'available' },
    { id: 'twilio', name: 'Twilio', category: 'Communication', description: 'SMS and voice notifications.', icon: 'Phone', status: 'coming_soon' },

    // Project Management
    { id: 'jira', name: 'Jira', category: 'Project Management', description: 'Issue and project tracking.', icon: 'Trello', status: 'coming_soon' },
    { id: 'linear', name: 'Linear', category: 'Project Management', description: 'Issue tracking built for speed.', icon: 'Zap', status: 'coming_soon' },
    { id: 'asana', name: 'Asana', category: 'Project Management', description: 'Work management platform.', icon: 'CheckSquare', status: 'coming_soon' },
    { id: 'trello', name: 'Trello', category: 'Project Management', description: 'Collaborative tool for projects.', icon: 'Trello', status: 'coming_soon' },
    { id: 'notion', name: 'Notion', category: 'Project Management', description: 'All-in-one workspace.', icon: 'FileText', status: 'coming_soon' },
    { id: 'monday', name: 'Monday.com', category: 'Project Management', description: 'Work OS.', icon: 'Calendar', status: 'coming_soon' },
    { id: 'clickup', name: 'ClickUp', category: 'Project Management', description: 'One app to replace them all.', icon: 'CheckCircle', status: 'coming_soon' },
    { id: 'shortcut', name: 'Shortcut', category: 'Project Management', description: 'Project management for software teams.', icon: 'List', status: 'coming_soon' },
    { id: 'height', name: 'Height', category: 'Project Management', description: 'Project management tool.', icon: 'Kanban', status: 'coming_soon' },

    // Feature Flags
    { id: 'launchdarkly', name: 'LaunchDarkly', category: 'Feature Flags', description: 'Feature management platform.', icon: 'Flag', status: 'coming_soon' },
    { id: 'split', name: 'Split.io', category: 'Feature Flags', description: 'Feature delivery platform.', icon: 'GitMerge', status: 'coming_soon' },
    { id: 'optimizely', name: 'Optimizely', category: 'Feature Flags', description: 'Digital experience platform.', icon: 'Experiment', status: 'coming_soon' },
    { id: 'configcat', name: 'ConfigCat', category: 'Feature Flags', description: 'Feature flag service.', icon: 'ToggleRight', status: 'coming_soon' },

    // Analytics
    { id: 'mixpanel', name: 'Mixpanel', category: 'Analytics', description: 'Product analytics.', icon: 'BarChart', status: 'coming_soon' },
    { id: 'amplitude', name: 'Amplitude', category: 'Analytics', description: 'Digital optimization.', icon: 'TrendingUp', status: 'coming_soon' },
    { id: 'google_analytics', name: 'Google Analytics', category: 'Analytics', description: 'Web analytics service.', icon: 'PieChart', status: 'coming_soon' },
    { id: 'heap', name: 'Heap', category: 'Analytics', description: 'Product analytics.', icon: 'BarChart2', status: 'coming_soon' },

    // Security
    { id: 'snyk', name: 'Snyk', category: 'Security', description: 'Developer security platform.', icon: 'Shield', status: 'coming_soon' },
    { id: 'auth0', name: 'Auth0', category: 'Security', description: 'Authentication and authorization.', icon: 'Lock', status: 'coming_soon' },
    { id: '1password', name: '1Password', category: 'Security', description: 'Password management.', icon: 'Key', status: 'coming_soon' },
];
