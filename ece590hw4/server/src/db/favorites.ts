export type Favorite = {
  id: string;
  zip: string;
  name: string;
  region: string;
};

const US_ZIP = /^\d{5}$/;
const favorites: Favorite[] = [];
let nextId = 1;

export function isValidUsZip(zip: string): boolean {
  return US_ZIP.test(zip);
}

export function getAll(): Favorite[] {
  return [...favorites];
}

export function create(zip: string, name: string, region: string): Favorite | null {
  if (favorites.some((favorite) => favorite.zip === zip)) {
    return null;
  }

  const favorite: Favorite = {
    id: String(nextId),
    zip,
    name,
    region,
  };
  nextId += 1;
  favorites.push(favorite);
  return favorite;
}

export function remove(id: string): Favorite | null {
  const index = favorites.findIndex((favorite) => favorite.id === id);
  if (index === -1) {
    return null;
  }

  const [removed] = favorites.splice(index, 1);
  return removed;
}
