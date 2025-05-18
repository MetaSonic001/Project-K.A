// Groq API service implementation
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface RecipeRequest {
  ingredients: string[];
  preferences?: string[];
  time?: number;
  mood?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: { name: string; quantity: string; available: boolean }[];
  steps: string[];
  preparationTime: number;
  cookingTime: number;
  servings: number;
  imageUrl?: string;
  matchScore: number;
}

export const generateRecipes = async (
  request: RecipeRequest
): Promise<Recipe[]> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful cooking assistant that generates recipes based on available ingredients.',
          },
          {
            role: 'user',
            content: `Generate recipe suggestions using these ingredients: ${request.ingredients.join(', ')}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate recipes');
    }

    const data = await response.json();
    
    // For now, return mock data while we implement the full Groq integration
    return mockRecipes;
  } catch (error) {
    console.error('Error generating recipes:', error);
    return mockRecipes;
  }
};

export const getSuggestion = async (
  ingredients: string[],
  mood?: string
): Promise<string> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful cooking assistant that suggests dishes based on available ingredients.',
          },
          {
            role: 'user',
            content: `Suggest a dish I can make with these ingredients: ${ingredients.join(', ')}${mood ? `. I'm in the mood for something ${mood}` : ''}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get suggestion');
    }

    const data = await response.json();
    const suggestion = data.choices[0]?.message?.content;
    
    return suggestion || 'Based on your ingredients, I suggest making a delicious curry today!';
  } catch (error) {
    console.error('Error getting suggestion:', error);
    return 'Based on your ingredients, I suggest making a delicious curry today!';
  }
};

// Mock data for testing
const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    ingredients: [
      { name: 'Chicken', quantity: '500g', available: true },
      { name: 'Butter', quantity: '100g', available: true },
      { name: 'Tomato Puree', quantity: '200g', available: true },
      { name: 'Cream', quantity: '100ml', available: false },
      { name: 'Garam Masala', quantity: '2 tsp', available: true },
    ],
    steps: [
      'Marinate chicken with yogurt and spices for 30 minutes',
      'Heat butter in a pan and cook chicken until golden',
      'Add tomato puree and simmer for 15 minutes',
      'Stir in cream and garam masala',
      'Simmer until chicken is cooked through and sauce thickens',
    ],
    preparationTime: 40,
    cookingTime: 30,
    servings: 4,
    imageUrl: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg',
    matchScore: 85,
  },
  {
    id: '2',
    name: 'Vegetable Biryani',
    ingredients: [
      { name: 'Basmati Rice', quantity: '300g', available: true },
      { name: 'Mixed Vegetables', quantity: '400g', available: true },
      { name: 'Onions', quantity: '2 medium', available: true },
      { name: 'Biryani Masala', quantity: '2 tbsp', available: true },
      { name: 'Yogurt', quantity: '100g', available: false },
    ],
    steps: [
      'Soak rice for 30 minutes, then par-boil it',
      'Sauté onions until golden brown',
      'Add vegetables and spices, cook for 5 minutes',
      'Layer par-boiled rice and vegetable mixture',
      'Cover and cook on low heat for 15-20 minutes',
    ],
    preparationTime: 45,
    cookingTime: 30,
    servings: 4,
    imageUrl: 'https://images.pexels.com/photos/7625089/pexels-photo-7625089.jpeg',
    matchScore: 92,
  },
  {
    id: '3',
    name: 'Masala Dosa',
    ingredients: [
      { name: 'Dosa Batter', quantity: '500g', available: true },
      { name: 'Potatoes', quantity: '4 medium', available: true },
      { name: 'Onions', quantity: '2 medium', available: true },
      { name: 'Green Chillies', quantity: '3', available: true },
      { name: 'Mustard Seeds', quantity: '1 tsp', available: true },
    ],
    steps: [
      'Boil and mash potatoes',
      'Temper mustard seeds, add onions and green chillies',
      'Add mashed potatoes and mix well',
      'Spread dosa batter on a hot pan',
      'Add potato filling and fold the dosa',
    ],
    preparationTime: 20,
    cookingTime: 15,
    servings: 3,
    imageUrl: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
    matchScore: 78,
  },
];