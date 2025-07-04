
import axios from 'axios';

export function normalizeRecipe(recipe) {
    // Helper to convert "00:45:00" to 45 (minutes)
    function durationToMinutes(duration) {
        if (typeof duration === 'number') return duration;
        if (!duration) return 0;
        const parts = duration.split(':').map(Number);
        if (parts.length === 3) {
            return parts[0] * 60 + parts[1] + Math.round(parts[2] / 60);
        }
        return 0;
    }

    return {
        aggregateLikes: recipe.popularity ?? 0,
        glutenFree: recipe.gluten_free ?? false,
        id: Number(recipe.id),
        image: recipe.recipe_image ?? recipe.image,
        readyInMinutes: durationToMinutes(recipe.prep_duration ?? recipe.readyInMinutes),
        title: recipe.recipe_title ?? recipe.title,
        vegan: recipe.vegan ?? false,
        vegetarian: recipe.vegetarian ?? false,
        // Optionally add more fields as needed
    };
}


/**
 * Fetches full recipe objects by ID list from an endpoint like:
 * /users/favoriteRecipes, /users/last, etc.
 *
 * @param {Object} options
 * @param {string} options.path - API path that returns an array of recipe IDs
 * @param {string} options.serverDomain - Full domain like http://localhost:3000
 * @param {string} [options.logPurpose] - Name for logging/debugging
 * @param {boolean} [options.withCredentials=true]
 * @returns {Promise<Array>} Normalized recipe objects
 */
export async function fetchRecipes({
                                       path,
                                       serverDomain,
                                       logPurpose = 'Recipe fetch',
                                       withCredentials = true
                                   })
{
    console.log(`[${logPurpose}] Starting fetch from ${path}...`);

    try {
        // Step 1: fetch recipe IDs
        const idRes = await axios.get(`${serverDomain}${path}`, { withCredentials });
        const ids = idRes.data;

        if (!Array.isArray(ids) || ids.length === 0) {
            console.log(`[${logPurpose}] No recipes found.`);
            return [];
        }

        // Step 2: fetch each full recipe by ID
        console.log(`[${logPurpose}] Fetching ${ids.length} recipes...`);
        console.log("Recipe IDs being fetched:", ids);
        const requests = ids.map(id =>
            axios.get(`${serverDomain}/recipes/${id}`, { withCredentials })
        );
        
        const results = await Promise.all(requests);
        const recipes = results.map(r => normalizeRecipe(r.data));
        console.log(`[${logPurpose}] Done. ${recipes.length} recipes loaded.`);
        console.log(`[${logPurpose}] Loaded recipe IDs: ${recipes.map(r => r.id).join(', ')}`);

        return recipes;

    } catch (err) {
        console.error(`[${logPurpose}] Failed to fetch recipes from ${path}:`, err);
        throw err;
    }
}
