"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";
import AuthorService from "@/services/author.service";
import SettingsTab from "@/components/dashboard/SettingsTab"; // Assuming you kept the component we built earlier

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      AuthorService.getMe()
        .then(setProfile)
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="py-20 flex justify-center"><Spinner /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       {/* Use the exact SettingsTab component we built, passing the freshly fetched profile */}
       <SettingsTab profile={profile} />
    </div>
  );
}