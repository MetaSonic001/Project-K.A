// This file would contain the implementation for fetching images dynamically
// For now, we'll use mock data

export interface ImageSearchResult {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export const searchImageForFood = async (
  foodName: string
): Promise<ImageSearchResult> => {
  try {
    // In a real implementation, this would call an image search API
    // For now, return a placeholder from our mock data
    const mockImage = mockFoodImages[foodName.toLowerCase()] || defaultFoodImage;
    return mockImage;
  } catch (error) {
    console.error('Error searching for food image:', error);
    return defaultFoodImage;
  }
};

// Mock image data for common food items
const mockFoodImages: Record<string, ImageSearchResult> = {
  rice: {
    url: 'https://images.pexels.com/photos/4198050/pexels-photo-4198050.jpeg',
    width: 600,
    height: 400,
    alt: 'Rice in a bowl',
  },
  chicken: {
    url: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
    width: 600,
    height: 400,
    alt: 'Raw chicken meat',
  },
  tomatoes: {
    url: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
    width: 600,
    height: 400,
    alt: 'Fresh tomatoes',
  },
  onions: {
    url: 'https://images.pexels.com/photos/4197447/pexels-photo-4197447.jpeg',
    width: 600,
    height: 400,
    alt: 'Fresh onions',
  },
  potatoes: {
    url: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-144248.jpeg',
    width: 600,
    height: 400,
    alt: 'Fresh potatoes',
  },
  garlic: {
    url: 'https://images.pexels.com/photos/4197442/pexels-photo-4197442.jpeg',
    width: 600,
    height: 400,
    alt: 'Fresh garlic',
  },
  flour: {
    url: 'https://images.pexels.com/photos/5765/flour-food-kitchen-bakery.jpg',
    width: 600,
    height: 400,
    alt: 'Flour in a bowl',
  },
  oil: {
    url: 'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg',
    width: 600,
    height: 400,
    alt: 'Cooking oil',
  },
  salt: {
    url: 'https://images.pexels.com/photos/531247/pexels-photo-531247.jpeg',
    width: 600,
    height: 400,
    alt: 'Salt crystals',
  },
  sugar: {
    url: 'https://images.pexels.com/photos/1109087/pexels-photo-1109087.jpeg',
    width: 600,
    height: 400,
    alt: 'Sugar in a bowl',
  },
};

const defaultFoodImage: ImageSearchResult = {
  url: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
  width: 600,
  height: 400,
  alt: 'Food ingredient',
};