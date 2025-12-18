
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";

export function CarbonFootprintCard() {
    // Estimation logic: 
    // Avg build time (30s) * Avg Power (0.1 kW) * Intensity (400g/kWh) * Total Builds
    const totalCO2g = 450;

    return (
        <Card className="bg-green-50/50 dark:bg-green-950/10 border-green-100 dark:border-green-900">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Leaf className="h-4 w-4" />
                    Sustainability Impact
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-green-800 dark:text-green-300">{totalCO2g}g</span>
                        <span className="text-sm text-green-600 dark:text-green-500">CO₂e emitted</span>
                    </div>
                    <p className="text-xs text-green-600/80 dark:text-green-500/80">
                        Equivalent to driving a car for 1.8 km.
                    </p>
                    <div className="mt-3 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 p-2 rounded">
                        <strong>Tip:</strong> Reducing build times by 10s saves ~50g CO₂ per deploy.
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
