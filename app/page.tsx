import CategoriesList from "@/components/home/CategoriesList";
import PropertiesContainer from "@/components/home/PropertiesContainer";
import LoadingCards from "@/components/card/LoadingCards";
import { Suspense } from "react";

async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <section>
      <CategoriesList
        category={resolvedSearchParams?.category}
        search={resolvedSearchParams?.search}
      />
      <Suspense fallback={<LoadingCards />}>
        <PropertiesContainer
          category={resolvedSearchParams?.category}
          search={resolvedSearchParams?.search}
        />
      </Suspense>
    </section>
  );
}

export default HomePage;
