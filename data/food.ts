export interface Food {
  id: string;
  name: string;
  brand: string;
  image_url: string;
  nutriscore: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

const OPENFOODFACTS_API =
    "https://fr.openfoodfacts.org/api/v2/product";

export async function searchFood(
    barcode: string
): Promise<Food | null> {
    try {
        const response = await fetch(
            `${OPENFOODFACTS_API}/${barcode}.json`,
            {
                headers: {
                    "User-Agent": "MonApp/1.0"
                }
            }
        );

        const data = await response.json();

        if (data.status === 0) return null;

        const product = data.product;

        return {
            id: barcode,
            name:
                product.product_name ||
                product.product_name_fr ||
                product.product_name_en ||
                "Nom inconnu",
            brand: product.brands || "Marque inconnue",
            image_url: product.image_url || "",
            nutriscore: product.nutriscore_grade || "N/A",
            calories: product.nutriments?.["energy-kcal_100g"] ?? 0,
            proteins: product.nutriments?.["proteins_100g"] ?? 0,
            carbs: product.nutriments?.["carbohydrates_100g"] ?? 0,
            fats: product.nutriments?.["fat_100g"] ?? 0,
        };
    } catch (error) {
        console.error("Error fetching food data:", error);
        return null;
    }
}

export async function searchFoodByText(
  query: string
): Promise<Food[]> {
  if (!query) return [];

  try {
    const params = new URLSearchParams({
      search_terms: query,
      search_simple: "1",
      action: "process",
      json: "1",
      page_size: "10",
      fields:
        "code,product_name,product_name_fr,product_name_en,brands,image_url,nutriscore_grade,nutriments"
    });

    const response = await fetch(
      `https://fr.openfoodfacts.org/cgi/search.pl?${params.toString()}`,
      {
        headers: {
          "User-Agent": "MonApp/1.0",
        },
      }
    );

    const data = await response.json();

    return (data.products || []).map((product: any) => ({
      id: product.code,
      name:
        product.product_name ||
        product.product_name_fr ||
        product.product_name_en ||
        "Nom inconnu",
      brand: product.brands || "Marque inconnue",
      image_url: product.image_url || "",
      nutriscore: product.nutriscore_grade || "N/A",
      calories: product.nutriments?.["energy-kcal_100g"] ?? 0,
      proteins: product.nutriments?.["proteins_100g"] ?? 0,
      carbs: product.nutriments?.["carbohydrates_100g"] ?? 0,
      fats: product.nutriments?.["fat_100g"] ?? 0,
    }));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
