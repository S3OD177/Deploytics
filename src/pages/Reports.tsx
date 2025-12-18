
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    FileText, Download, Loader2, Shield, Activity, DollarSign,
    BarChart3, Users, Clock, Calendar, Search, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// 25+ Report Definitions
const REPORTS = [
    // Compliance
    { id: "soc2", title: "SOC2 Audit Log", category: "Compliance", description: "Comprehensive audit trail for SOC2 compliance.", format: "PDF" },
    { id: "gdpr", title: "GDPR Data Export", category: "Compliance", description: "Personal data export for GDPR requests.", format: "JSON" },
    { id: "hipaa", title: "HIPAA Access Log", category: "Compliance", description: "PHI access logs and modification history.", format: "CSV" },
    { id: "iso", title: "ISO 27001 Checklist", category: "Compliance", description: "Security controls status report.", format: "PDF" },
    { id: "pci", title: "PCI-DSS Scan", category: "Compliance", description: "Payment security standards assessment.", format: "PDF" },

    // Performance
    { id: "latency", title: "Weekly Latency Report", category: "Performance", description: "p95 and p99 latency metrics by endpoint.", format: "PDF" },
    { id: "sla", title: "Uptime SLA Report", category: "Performance", description: "Availability metrics vs SLA targets.", format: "PDF" },
    { id: "api_usage", title: "API Usage Breakdown", category: "Performance", description: "Request volume by consumer and route.", format: "CSV" },
    { id: "slow_endpoints", title: "Slowest Endpoints Analysis", category: "Performance", description: "Top 10 slowest API paths.", format: "Excel" },
    { id: "cache", title: "Cache Hit Ratios", category: "Performance", description: "CDN and Redis efficiency report.", format: "PDF" },

    // Cost
    { id: "spend_monthly", title: "Monthly Cloud Spend", category: "Cost", description: "Aggregated cost across all providers.", format: "PDF" },
    { id: "invoice", title: "Detailed Invoice Breakdown", category: "Cost", description: "Line-item expenses for finance.", format: "CSV" },
    { id: "forecast", title: "Cost Forecast", category: "Cost", description: "AI-predicted spending for next quarter.", format: "PDF" },
    { id: "resources", title: "Resource Utilization", category: "Cost", description: "Underutilized instance detection.", format: "CSV" },
    { id: "vendor", title: "Vendor Analysis", category: "Cost", description: "Spend distribution by vendor.", format: "PDF" },

    // Security
    { id: "vuln", title: "Vulnerability Scan", category: "Security", description: "Summary of detected CVEs and risks.", format: "PDF" },
    { id: "login_failures", title: "Failed Login Attempts", category: "Security", description: "Suspicious authentication activity.", format: "CSV" },
    { id: "rbac_audit", title: "Role Permission Audit", category: "Security", description: "User permission and role assignments.", format: "PDF" },
    { id: "api_keys", title: "API Key Usage Report", category: "Security", description: "Active key utilization and age.", format: "CSV" },
    { id: "dependency", title: "Dependency Audit", category: "Security", description: "Outdated and vulnerable packages.", format: "JSON" },

    // Quality & DORA
    { id: "deployment_success", title: "Deployment Success Rate", category: "Quality", description: "Success vs Failure ratios.", format: "PDF" },
    { id: "lead_time", title: "Lead Time for Changes", category: "Quality", description: "Commit to deploy measurement.", format: "PDF" },
    { id: "mttr", title: "MTTR Analysis", category: "Quality", description: "Mean time to restore service.", format: "PDF" },
    { id: "coverage", title: "Code Coverage Trends", category: "Quality", description: "Test coverage over time.", format: "HTML" },

    // Team
    { id: "velocity", title: "Developer Velocity", category: "Team", description: "PRs merged and deployed per engineer.", format: "PDF" },
    { id: "oncall", title: "On-call Burden", category: "Team", description: "Incident volume and paging hours.", format: "CSV" },
    { id: "reviews", title: "Review Turnaround", category: "Team", description: "Average time to review PRs.", format: "PDF" },
];

const CATEGORIES = ["All", "Compliance", "Performance", "Cost", "Security", "Quality", "Team"];

export default function Reports() {
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    const filteredReports = REPORTS.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeTab === "All" || report.category === activeTab;
        return matchesSearch && matchesCategory;
    });

    const handleGenerate = (id: string, title: string) => {
        setGeneratingId(id);
        // Simulate generation delay
        setTimeout(() => {
            setGeneratingId(null);
            toast.success(`Generated ${title}`, {
                description: `${title} has been generated and sent to your email.`,
                icon: <Download className="size-4 text-emerald-500" />
            });
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reports Hub</h1>
                <p className="text-muted-foreground mt-2">
                    Generate and export distinct operational, security, and compliance reports.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                {/* Search */}
                <div className="relative w-full md:w-64 order-2 md:order-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search reports..."
                        className="pl-9 h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className="order-1 md:order-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="flex p-1 bg-muted/50 border border-border rounded-lg gap-1 min-w-max">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                                    activeTab === cat
                                        ? "bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredReports.map((report) => (
                    <Card key={report.id} className="group hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <FileText className="size-4" />
                                    </div>
                                    <Badge variant="outline" className="text-[10px] h-5 font-normal">
                                        {report.format}
                                    </Badge>
                                </div>
                                <Badge variant="secondary" className="text-[10px] bg-secondary/50 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {report.category}
                                </Badge>
                            </div>
                            <CardTitle className="mt-3 text-lg leading-tight group-hover:text-primary transition-colors">
                                {report.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                                {report.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full gap-2 font-medium"
                                variant="outline"
                                onClick={() => handleGenerate(report.id, report.title)}
                                disabled={generatingId === report.id}
                            >
                                {generatingId === report.id ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download className="size-4" />
                                        Generate Report
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
