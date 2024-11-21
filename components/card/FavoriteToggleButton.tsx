import { auth } from "@clerk/nextjs/server";
import { CardSignInButton } from "../form/Buttons";
import { fetchFavoriteId } from "@/utils/actions";
import FavoriteToggleForm from "./FavoriteToggleForm";

async function FavoriteToggleButton({ propertyId }: { propertyId: string }) {
  const { userId } = await auth();

  if (!userId) return <CardSignInButton />;
  const favoriteIdResult = await fetchFavoriteId({ propertyId });
  const favoriteId = typeof favoriteIdResult === 'string' ? favoriteIdResult : null;

  return <FavoriteToggleForm favoriteId={favoriteId} propertyId={propertyId} />;
}

export default FavoriteToggleButton;
