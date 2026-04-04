"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";
import AuthorService from "@/services/author.service";
import { formatCompactNumber } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      AuthorService.getStats(user.id)
        .then(setStats)
        .catch(err => console.error("Stats fetch error:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="py-20 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-serif font-bold mb-6">At a Glance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard label="Total Articles" value={stats?.total_articles || 0} />
          <StatCard label="Published" value={stats?.published_articles || 0} />
          <StatCard label="Total Views" value={formatCompactNumber(stats?.total_views || 0)} />
          <StatCard label="Total Likes" value={stats?.total_likes || 0} />
          <StatCard label="Avg Rating" value={stats?.avg_rating || "N/A"} />
        </div>
      </div>

      <Card className="bg-card border border-border shadow-none rounded-2xl overflow-hidden mt-8">
        <CardBody className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border/50 bg-background/50 m-4 rounded-xl">
           <h4 className="text-xl font-serif font-bold text-foreground mb-2">Detailed Analytics</h4>
           <p className="text-muted-foreground text-sm max-w-md">
             Advanced graphical insights and audience retention metrics will be available here soon.
           </p>
        </CardBody>
      </Card>
    </div>
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