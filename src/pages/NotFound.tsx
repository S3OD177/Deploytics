import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Construction, ArrowLeft } from "lucide-react"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="bg-muted/50 p-6 rounded-full mb-6">
                <Construction className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Page not found</h1>
            <p className="text-muted-foreground mb-8 max-w-sm">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                </Button>
                <Button onClick={() => navigate("/")}>Go Home</Button>
            </div>
        </div>
    )
}
