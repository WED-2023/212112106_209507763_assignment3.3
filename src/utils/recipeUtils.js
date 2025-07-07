
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
 * Fetches full recipe objects by ID list or by path to an endpoint that returns IDs.
 *
 * @param {Object} options
 * @param {string} [options.path] - API path that returns an array of recipe IDs
 * @param {Array} [options.ids] - Array of recipe IDs (if already known)
 * @param {string} options.serverDomain - Full domain like http://localhost:3000
 * @param {string} [options.logPurpose] - Name for logging/debugging
 * @param {boolean} [options.withCredentials=true]
 * @param {Object} [options.req] - Express request object (for cookies/session)
 * @returns {Promise<Array>} Normalized recipe objects
 */
export async function fetchRecipes({
    path,
    ids,
    serverDomain,
    logPurpose = 'Recipe fetch',
    withCredentials = true,
    req
}) {
    console.log(`[${logPurpose}] Starting fetch...`);

    try {
        // Step 1: fetch recipe IDs if not provided
        let recipeIds = ids;
        if (!recipeIds && path) {
            const idRes = await axios.get(`${serverDomain}/api${path}`, { withCredentials });
            recipeIds = idRes.data;
        }

        if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
            console.log(`[${logPurpose}] No recipes found.`);
            return [];
        }

        // Step 2: fetch each full recipe by ID
        console.log(`[${logPurpose}] Fetching ${recipeIds.length} recipes...`);
        const requests = recipeIds.map(id =>
            axios.get(`${serverDomain}/api/recipes/${id}`, {
                withCredentials,
                headers: req && req.headers.cookie ? { cookie: req.headers.cookie } : {},
            })
        );

        const results = await Promise.all(requests);
        const recipes = results.map(r => normalizeRecipe(r.data));
        console.log(`[${logPurpose}] Done. ${recipes.length} recipes loaded.`);
        return recipes;

    } catch (err) {
        console.error(`[${logPurpose}] Failed to fetch recipes:`, err);
        throw err;
    }
}
