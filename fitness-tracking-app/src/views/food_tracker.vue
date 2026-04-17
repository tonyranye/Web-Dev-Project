<template>
  <div class="food-tracker-container">
    <!-- Info Section -->
    <div class="info-banner">
      <div class="info-content">
        <h3>Daily Calorie Guidelines</h3>
        <p>The average adult woman needs approximately <strong>2,000-2,400 calories</strong> per day, while the average adult man needs approximately <strong>2,400-3,000 calories</strong> per day. These values depend on age, activity level, and metabolism. Use this tracker to monitor your intake and maintain a balanced diet.</p>
      </div>
    </div>

    <!-- Left side: Food Input and Log -->
    <div class="food-log-section">
      <!-- Input Form -->
      <div class="input-card">
        <h2>Log Your Food</h2>
        <form @submit.prevent="addFoodEntry">
          <div class="form-group">
            <label for="food-name">Food Name</label>
            <input 
              id="food-name"
              v-model="newFood.name" 
              type="text" 
              placeholder="E.g., Chicken Breast, Apple, Pasta"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="calories">Calories</label>
            <input 
              id="calories"
              v-model.number="newFood.calories" 
              type="number" 
              placeholder="Enter calories"
              min="0"
              required
            />
          </div>

          <div class="form-group">
            <label for="mealtime">Mealtime</label>
            <select id="mealtime" v-model="newFood.mealtime" required>
              <option disabled value="">Select mealtime</option>
              <option>breakfast</option>
              <option>lunch</option>
              <option>dinner</option>
            </select>
          </div>
          
          <button type="submit" class="submit-btn">Log Food</button>
        </form>
      </div>

      <!-- Food Entries (Most Recent First) -->
      <div class="food-entries">
        <div v-if="foodLog.length === 0" class="empty-state">
          <p>No food logged yet. Start by adding your first entry!</p>
        </div>
        
        <div v-for="entry in foodLog" :key="entry.meal_id" class="food-card">
          <div class="card-header">
            <h3>{{ entry.name }}</h3>
            <button @click="removeFoodEntry(entry.meal_id)" class="delete-btn">✕</button>
          </div>
          <div class="card-details">
            <p><strong>Calories:</strong> {{ entry.calories }}</p>
            <p><strong>Time:</strong> {{ formatTime(entry.timestamp) }}</p>
            <p><strong>Date:</strong> {{ formatDate(entry.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side: Statistics -->
    <div class="stats-section">
      <h2>Statistics</h2>
      
      <div class="stat-card">
        <h3>Today</h3>
        <p class="stat-value">{{ todayCalories }}</p>
        <p class="stat-label">calories</p>
      </div>

      <div class="stat-card">
        <h3>This Week</h3>
        <p class="stat-value">{{ thisWeekCalories }}</p>
        <p class="stat-label">total calories</p>
      </div>

      <div class="stat-card">
        <h3>Net Daily Calories</h3>
        <p class="stat-value" :class="{ negative: netDailyCalories < 0 }">{{ netDailyCalories }}</p>
        <p class="stat-label">today (food - workouts)</p>
      </div>

      <div class="stat-card">
        <h3>Average Daily</h3>
        <p class="stat-value">{{ averageDailyCalories }}</p>
        <p class="stat-label">calories</p>
      </div>

      <div class="stat-card highlight">
        <h3>Total Logged</h3>
        <p class="stat-value">{{ totalCalories }}</p>
        <p class="stat-label">calories</p>
      </div>
    </div>
  </div>
</template>
<script>
import { supabase } from '@/lib/supabase'

export default {
  data() {
    return {
      newFood: {
        name: '',
        calories: null,
        mealtime: ''
      },
      foodLog: []
    }
  },

  computed: {
    todayCalories() {
      return this.getCaloriesForDate(new Date());
    },
    thisWeekCalories() {
      return this.getCaloriesForWeek();
    },
    netDailyCalories() {
      const todayFood = this.todayCalories;
      const todayWorkouts = this.getWorkoutCaloriesForDate(new Date());
      return todayFood - todayWorkouts;
    },
    totalCalories() {
      return this.foodLog.reduce((sum, entry) => sum + entry.calories, 0);
    },
    averageDailyCalories() {
      if (this.foodLog.length === 0) return 0;
      const uniqueDays = new Set();
      this.foodLog.forEach(entry => {
        uniqueDays.add(this.formatDate(entry.timestamp));
      });
      return Math.round(this.totalCalories / uniqueDays.size);
    }
  },

  methods: {
    async addFoodEntry() {
      if (!this.newFood.name || this.newFood.calories === null) {
        alert('Please fill in all fields');
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        alert('You must be logged in to log food.');
        return;
      }

      const user = userData.user;

      const { data, error } = await supabase
        .from('meals')
        .insert({
          user_id: user.id,
          name: this.newFood.name,
          calories: this.newFood.calories,
          mealtime: this.newFood.mealtime
        })
        .select();

      if (error) {
        console.error(error);
        alert('Failed to log food.');
        return;
      }

      const inserted = data[0];

      this.foodLog.unshift({
        ...inserted,
        timestamp: new Date(inserted.created_at)
      });

      this.newFood = {
        name: '',
        calories: null,
        mealtime: ''
      };
    },

    async removeFoodEntry(mealId) {
      // Delete from Supabase
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('meal_id', mealId);

      if (error) {
        console.error("Error deleting meal:", error);
        alert("Failed to delete meal.");
        return;
      }

      // Remove from UI
      this.foodLog = this.foodLog.filter(entry => entry.meal_id !== mealId);
    },

    
    // Summary stats for food tracking
    getCaloriesForDate(date) {
      const dateStr = this.formatDate(date);
      return this.foodLog
        .filter(entry => this.formatDate(entry.timestamp) === dateStr)
        .reduce((sum, entry) => sum + entry.calories, 0);
    },

    getCaloriesForWeek() {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return this.foodLog
        .filter(entry => entry.timestamp >= weekAgo)
        .reduce((sum, entry) => sum + entry.calories, 0);
    },

    getWorkoutCaloriesForDate(date) {
      const dateStr = this.formatDate(date);
      const workoutLog = JSON.parse(localStorage.getItem('workoutLog') || '[]');
      return workoutLog
        .filter(entry => {
          const entryDate = new Date(entry.timestamp);
          return this.formatDate(entryDate) === dateStr;
        })
        .reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0);
    },

    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    },

    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    },

    // Functions that load and upload meals
    async loadRecentMeals() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error('No user found:', userError);
        return;
      }

      const user = userData.user;

      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error loading meals:', error);
        return;
      }

      this.foodLog = data.map(entry => ({
        ...entry,
        timestamp: new Date(entry.created_at)
      }));
    }
  },

  mounted() {
    this.loadRecentMeals();
  }
}
</script>


<style scoped>
.food-tracker-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #1a1a1a;
  min-height: 100vh;
}

/* Info Banner */
.info-banner {
  grid-column: 1 / -1;
  background: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4CAF50;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.info-content h3 {
  margin: 0 0 0.75rem 0;
  color: #4CAF50;
  font-size: 1.1rem;
}

.info-content p {
  margin: 0;
  color: #b0b0b0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.info-content strong {
  color: #66bb6a;
  font-weight: 700;
}

/* Left Section */
.food-log-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.input-card {
  background: #2a2a2a;
  border: 2px solid #4CAF50;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.input-card h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #4CAF50;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #b0b0b0;
  font-size: 0.95rem;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #3a3a3a;
  background: #333;
  color: #fff;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: #666;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  background: #2a2a2a;
}

.form-group select {
  padding: 0.75rem;
  border: 2px solid #3a3a3a;
  background: #333;
  color: #fff;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  appearance: none; /* removes default arrow */
  cursor: pointer;
}

/* Add a custom arrow */
.form-group select {
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.form-group select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  background: #2a2a2a;
}

.form-group select option {
  background: #2a2a2a;
  color: #fff;
}


.submit-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Food Entries */
.food-entries {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  background: #2a2a2a;
  border: 2px dashed #4CAF50;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: #666;
}

.food-card {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  border: 2px solid #4CAF50;
}

.food-card:hover {
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  color: #66bb6a;
  font-size: 1.25rem;
}

.delete-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: #ee5a52;
  transform: scale(1.1);
}

.card-details {
  display: grid;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #a0a0a0;
}

.card-details p {
  margin: 0;
}

.card-details strong {
  color: #ccc;
}

/* Right Section - Statistics */
.stats-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.stats-section h2 {
  margin: 0 0 0.5rem 0;
  color: #fff;
  font-size: 1.5rem;
}

.stat-card {
  background: #2a2a2a;
  border: 2px solid #4CAF50;
  border-radius: 12px;
  padding: 0.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: all 0.3s ease;
  height: 140px;
  width: 300px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.3);
}

.stat-card h3 {
  margin: 0 0 0.75rem 0;
  color: #a0a0a0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.stat-value {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: bold;
  color: #4CAF50;
}

.stat-value.negative {
  color: #ff9800;
}

.stat-label {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
}

.stat-card.highlight {
  background: linear-gradient(135deg, #2a5f2a, #1f4620);
  border: 2px solid #66bb6a;
  color: white;
}

.stat-card.highlight h3 {
  color: #a0a0a0;
}

.stat-card.highlight .stat-value {
  color: #66bb6a;
}

.stat-card.highlight .stat-label {
  color: #888;
}

/* Responsive Design */
@media (max-width: 768px) {
  .food-tracker-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1rem;
  }

  .stats-section {
    position: static;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .input-card {
    padding: 1.5rem;
  }

  .stat-value {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .food-tracker-container {
    padding: 0.5rem;
  }

  .input-card,
  .food-card,
  .stat-card {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .delete-btn {
    align-self: flex-end;
  }
}
</style>