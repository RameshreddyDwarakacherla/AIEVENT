import mongoose from 'mongoose';

const budgetItemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Venue', 'Catering', 'Decoration', 'Entertainment', 'Photography', 'Transportation', 'Miscellaneous', 'Other']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  allocatedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  spentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date
  }
}, { timestamps: true });

const budgetSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },
  totalAllocated: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD']
  },
  items: [budgetItemSchema],
  alerts: [{
    type: {
      type: String,
      enum: ['overspending', 'approaching_limit', 'payment_due', 'budget_exceeded']
    },
    message: String,
    category: String,
    amount: Number,
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    trim: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for remaining budget
budgetSchema.virtual('remainingBudget').get(function() {
  return this.totalBudget - this.totalSpent;
});

// Virtual for budget utilization percentage
budgetSchema.virtual('utilizationPercentage').get(function() {
  return this.totalBudget > 0 ? (this.totalSpent / this.totalBudget) * 100 : 0;
});

// Method to check for budget alerts
budgetSchema.methods.checkAlerts = function() {
  const alerts = [];
  const utilizationPercentage = this.utilizationPercentage;

  // Check overall budget
  if (utilizationPercentage >= 100) {
    alerts.push({
      type: 'budget_exceeded',
      message: `Budget exceeded! You've spent $${this.totalSpent.toFixed(2)} of $${this.totalBudget.toFixed(2)}`,
      amount: this.totalSpent - this.totalBudget
    });
  } else if (utilizationPercentage >= 90) {
    alerts.push({
      type: 'approaching_limit',
      message: `Warning: You've used ${utilizationPercentage.toFixed(1)}% of your budget`,
      amount: this.totalSpent
    });
  }

  // Check category budgets
  this.items.forEach(item => {
    const categoryUtilization = item.allocatedAmount > 0 
      ? (item.spentAmount / item.allocatedAmount) * 100 
      : 0;

    if (categoryUtilization > 100) {
      alerts.push({
        type: 'overspending',
        message: `${item.category} is over budget by $${(item.spentAmount - item.allocatedAmount).toFixed(2)}`,
        category: item.category,
        amount: item.spentAmount - item.allocatedAmount
      });
    }

    // Check payment due dates
    if (item.dueDate && !item.isPaid) {
      const daysUntilDue = Math.ceil((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 7 && daysUntilDue >= 0) {
        alerts.push({
          type: 'payment_due',
          message: `Payment for ${item.category} due in ${daysUntilDue} days`,
          category: item.category,
          amount: item.allocatedAmount - item.spentAmount
        });
      }
    }
  });

  return alerts;
};

// Update totals before saving
budgetSchema.pre('save', function(next) {
  this.totalAllocated = this.items.reduce((sum, item) => sum + item.allocatedAmount, 0);
  this.totalSpent = this.items.reduce((sum, item) => sum + item.spentAmount, 0);
  
  // Add new alerts
  const newAlerts = this.checkAlerts();
  newAlerts.forEach(alert => {
    // Check if similar alert already exists
    const exists = this.alerts.some(a => 
      a.type === alert.type && 
      a.category === alert.category &&
      !a.isRead
    );
    if (!exists) {
      this.alerts.push(alert);
    }
  });
  
  next();
});

// Indexes for performance
budgetSchema.index({ eventId: 1 });
budgetSchema.index({ userId: 1 });
budgetSchema.index({ createdAt: -1 });

export default mongoose.model('Budget', budgetSchema);
