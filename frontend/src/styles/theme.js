// Green Theme Color Palette for AI Event Planner
export const greenTheme = {
  // Primary colors
  primary: '#2E7D32',      // Forest Green
  secondary: '#43A047',    // Medium Green
  dark: '#1B5E20',         // Dark Forest Green
  light: '#81C784',        // Light Green
  lighter: '#A5D6A7',      // Lighter Green
  lightest: '#C8E6C9',     // Lightest Green
  background: '#E8F5E9',   // Background Green
  
  // Extended green shades
  green50: '#E8F5E9',
  green100: '#C8E6C9',
  green200: '#A5D6A7',
  green300: '#81C784',
  green400: '#66BB6A',
  green500: '#4CAF50',
  green600: '#43A047',
  green700: '#388E3C',
  green800: '#2E7D32',
  green900: '#1B5E20',
  
  // Gradients for buttons and cards
  gradients: {
    primary: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
    dark: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
    light: 'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)',
    lighter: 'linear-gradient(135deg, #81C784 0%, #A5D6A7 100%)',
    background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    hero: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)',
  },
  
  // Background gradients for cards and sections
  bgGradients: [
    'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    'linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 100%)',
    'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)',
    'linear-gradient(135deg, #DCEDC8 0%, #C5E1A5 100%)',
  ],
  
  // Avatar gradients for user profiles
  avatarGradients: [
    'linear-gradient(135deg, #2E7D32, #43A047)',
    'linear-gradient(135deg, #1B5E20, #2E7D32)',
    'linear-gradient(135deg, #43A047, #66BB6A)',
    'linear-gradient(135deg, #388E3C, #4CAF50)',
    'linear-gradient(135deg, #2E7D32, #66BB6A)',
  ],
  
  // Feature colors (all green variations)
  features: {
    ai: '#2E7D32',           // Primary Green
    vendor: '#388E3C',       // Medium Green
    guest: '#43A047',        // Secondary Green
    budget: '#4CAF50',       // Balanced Green
    timeline: '#66BB6A',     // Light Green
    collaboration: '#1B5E20', // Dark Green
  },
  
  // Status colors (green-based)
  status: {
    success: '#4CAF50',
    warning: '#FFA726',
    error: '#EF5350',
    info: '#2E7D32',
  },
  
  // Helper function to get avatar gradient
  getAvatarGradient: (char = 'A') => {
    const gradients = [
      'linear-gradient(135deg, #2E7D32, #43A047)',
      'linear-gradient(135deg, #1B5E20, #2E7D32)',
      'linear-gradient(135deg, #43A047, #66BB6A)',
      'linear-gradient(135deg, #388E3C, #4CAF50)',
      'linear-gradient(135deg, #2E7D32, #66BB6A)',
    ];
    return gradients[char.charCodeAt(0) % gradients.length];
  },
  
  // Helper function to get feature color
  getFeatureColor: (index) => {
    const colors = ['#2E7D32', '#388E3C', '#43A047', '#4CAF50', '#66BB6A', '#1B5E20'];
    return colors[index % colors.length];
  },
  
  // Helper function to get background gradient
  getBgGradient: (index) => {
    const gradients = [
      'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
      'linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 100%)',
      'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)',
      'linear-gradient(135deg, #DCEDC8 0%, #C5E1A5 100%)',
    ];
    return gradients[index % gradients.length];
  }
};

// Export individual colors for convenience
export const {
  primary,
  secondary,
  dark,
  light,
  lighter,
  lightest,
  background,
  gradients,
  bgGradients,
  avatarGradients,
  features,
  status
} = greenTheme;

export default greenTheme;
