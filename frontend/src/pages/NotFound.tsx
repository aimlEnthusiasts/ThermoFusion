import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Satellite } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg max-w-md text-center">
            <CardContent className="py-12">
              <div className="mb-6 inline-flex items-center justify-center">
                <Satellite className="h-20 w-20 text-primary" />
              </div>
              <h1 className="mb-2 text-6xl font-bold">404</h1>
              <h2 className="mb-4 text-2xl font-bold">Lost in Space</h2>
              <p className="mb-8 text-muted-foreground">
                The page you're looking for has drifted into the cosmic void.
              </p>
              <Link to="/">
                <Button>
                  Return to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
