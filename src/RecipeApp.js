import React, { useState, useEffect } from 'react';
import './RecipeApp.css';

const RecipeApp = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 
  const API_BASE = 'https://localhost:7085/api/recipes';

 
  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError('Error fetching recipes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const getRecipeById = async (id) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      setSelectedRecipe(recipe);
    }
  };

  const getDifficultyClass = (difficulty) => {
    return `recipe-difficulty ${difficulty.toLowerCase()}`;
  };

  const formatTime = (minutes) => {
    if (minutes === 0) return '0min';
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="recipe-app">
      <h1>🍳 Recipe Management System</h1>
      
      {error && (
        <div className="error">
          ⚠️ {error}
        </div>
      )}
      
   
      <div className="recipe-list">
        <h2>📚 Recipe Collection</h2>
        <div className="recipe-count">
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} total
        </div>
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              {recipe.imageUrl && (
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.name} 
                  className="recipe-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.name}</h3>
                <p className="recipe-description">{recipe.description}</p>
                
                <div className="recipe-meta">
                  <span className="recipe-category">📂 {recipe.category}</span>
                  <span className={getDifficultyClass(recipe.difficulty)}>
                    {recipe.difficulty === 'Easy' && '🟢'}
                    {recipe.difficulty === 'Medium' && '🟡'}
                    {recipe.difficulty === 'Hard' && '🔴'}
                    {recipe.difficulty}
                  </span>
                </div>
                
                <div className="recipe-timing">
                  <span>⏱️ Prep: {formatTime(recipe.prepTimeMinutes)}</span>
                  <span>🔥 Cook: {formatTime(recipe.cookTimeMinutes)}</span>
                  <span>🍽️ Serves: {recipe.servings}</span>
                </div>
                
                {recipe.tags && recipe.tags.length > 0 && (
                  <div style={{marginBottom: '15px'}}>
                    {recipe.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                    {recipe.tags.length > 3 && (
                      <span className="tag">+{recipe.tags.length - 3} more</span>
                    )}
                  </div>
                )}
                
                <div className="recipe-actions">
                  <button onClick={() => getRecipeById(recipe.id)} className="btn btn-primary">
                    👁️ View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      {selectedRecipe && (
        <div className="recipe-details">
          <div className="recipe-details-header">
            <h2 className="recipe-details-title">🍳 {selectedRecipe.name}</h2>
            <p style={{fontSize: '18px', color: '#7f8c8d', marginBottom: '20px'}}>
              {selectedRecipe.description}
            </p>
          </div>
          
          {selectedRecipe.imageUrl && (
            <img 
              src={selectedRecipe.imageUrl} 
              alt={selectedRecipe.name} 
              className="recipe-details-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          
          <div className="recipe-details-meta">
            <div className="recipe-details-meta-item">
              <div className="recipe-details-meta-label">Category</div>
              <div className="recipe-details-meta-value">📂 {selectedRecipe.category}</div>
            </div>
            <div className="recipe-details-meta-item">
              <div className="recipe-details-meta-label">Difficulty</div>
              <div className="recipe-details-meta-value">
                {selectedRecipe.difficulty === 'Easy' && '🟢'}
                {selectedRecipe.difficulty === 'Medium' && '🟡'}
                {selectedRecipe.difficulty === 'Hard' && '🔴'}
                {selectedRecipe.difficulty}
              </div>
            </div>
            <div className="recipe-details-meta-item">
              <div className="recipe-details-meta-label">Prep Time</div>
              <div className="recipe-details-meta-value">⏱️ {formatTime(selectedRecipe.prepTimeMinutes)}</div>
            </div>
            <div className="recipe-details-meta-item">
              <div className="recipe-details-meta-label">Cook Time</div>
              <div className="recipe-details-meta-value">🔥 {formatTime(selectedRecipe.cookTimeMinutes)}</div>
            </div>
            <div className="recipe-details-meta-item">
              <div className="recipe-details-meta-label">Total Time</div>
              <div className="recipe-details-meta-value">⏰ {formatTime(selectedRecipe.prepTimeMinutes + selectedRecipe.cookTimeMinutes)}</div>
            </div>
            <div className="recipe-details-meta-item">
              <div className="recipe-details-meta-label">Servings</div>
              <div className="recipe-details-meta-value">🍽️ {selectedRecipe.servings}</div>
            </div>
          </div>
          
          <div className="ingredients-list">
            <h3>🛒 Ingredients</h3>
            <ul>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div className="instructions-list">
            <h3>📋 Instructions</h3>
            <ol>
              {selectedRecipe.steps.map((step, index) => (
                <li key={index}>
                  <div>{step.instruction}</div>
                  {step.timeMinutes && (
                    <div className="step-time">⏰ Takes about {formatTime(step.timeMinutes)}</div>
                  )}
                  {step.tip && (
                    <div className="step-tip">
                      <strong>💡 Pro Tip:</strong> {step.tip}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
          
          {selectedRecipe.tags && selectedRecipe.tags.length > 0 && (
            <div className="recipe-tags">
              <h3>🏷️ Tags</h3>
              {selectedRecipe.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          )}
          
          <button onClick={() => setSelectedRecipe(null)} className="btn btn-secondary close-details">
            ✖️ Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeApp;