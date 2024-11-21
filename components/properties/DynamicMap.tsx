"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";

export const DynamicMap = dynamic(
  () => import("@/components/properties/PropertyMap"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
  }
);
