import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";

export default function OverviewTab({ stats }) {
  // Format numbers (e.g., 1200 -> 1.2K)
  const formatNumber = (num) => {
    if (!num) return "0";
    return num > 999 ? (num / 1000).toFixed(1) + 'K' : num.toString();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h3 className="text-2xl font-serif font-bold mb-6">At a Glance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Views" value={formatNumber(stats?.total_views)} />
          <StatCard label="Total Likes" value={formatNumber(stats?.total_likes)} />
          <StatCard label="Published" value={stats?.published_articles || 0} />
          <StatCard label="Avg Rating" value={stats?.avg_rating || "N/A"} />
        </div>
      </div>

      <Card className="bg-card border border-border shadow-none rounded-2xl overflow-hidden mt-8">
        <CardBody className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border/50 bg-background/50 m-4 rounded-xl">
           <h4 className="text-xl font-serif font-bold text-foreground mb-2">Detailed Analytics</h4>
           <p className="text-muted-foreground text-sm max-w-md">
             Advanced graphical insights and audience retention metrics are currently being compiled. Check back soon for your full performance dashboard.
           </p>
        </CardBody>
      </Card>
    </motion.div>
  );
}

const StatCard = ({ label, value }) => (
  <Card className="bg-card border border-border shadow-sm rounded-2xl hover:border-brand-blue/30 transition-colors">
    <CardBody className="p-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-serif font-bold text-foreground">{value}</p>
    </CardBody>
  </Card>
);