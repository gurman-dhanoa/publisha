import PublishPage from "@/components/forms/ArticleForm";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <PublishPage />
    </Suspense>
  );
};

export default page;
