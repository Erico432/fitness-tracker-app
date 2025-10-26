const WorkoutTemplate = require('../models/WorkoutTemplate');

// Initialize default templates
const initializeTemplates = async () => {
  const defaultTemplates = [
    {
      name: '7-Minute HIIT',
      description: 'Quick high-intensity interval training for busy days',
      difficulty: 'beginner',
      category: 'cardio',
      duration: 7,
      estimatedCalories: 80,
      exercises: [
        { name: 'Jumping Jacks', duration: 30, notes: '30 seconds work' },
        { name: 'Wall Sit', duration: 30, notes: '30 seconds work' },
        { name: 'Push-ups', duration: 30, notes: '30 seconds work' },
        { name: 'Crunches', duration: 30, notes: '30 seconds work' },
        { name: 'Step-ups', duration: 30, notes: '30 seconds work' },
        { name: 'Squats', duration: 30, notes: '30 seconds work' },
        { name: 'Plank', duration: 30, notes: '30 seconds work' },
      ],
      isPublic: true,
      tags: ['quick', 'hiit', 'bodyweight', 'no-equipment'],
    },
    {
      name: 'Beginner Strength',
      description: 'Perfect for those starting their strength training journey',
      difficulty: 'beginner',
      category: 'strength',
      duration: 30,
      estimatedCalories: 150,
      exercises: [
        { name: 'Bodyweight Squats', sets: 3, reps: '10-12', notes: 'Focus on form' },
        { name: 'Push-ups', sets: 3, reps: '8-10', notes: 'Can do on knees' },
        { name: 'Lunges', sets: 3, reps: '10 each leg', notes: 'Alternate legs' },
        { name: 'Plank', sets: 3, reps: '30 seconds', notes: 'Keep core tight' },
        { name: 'Dumbbell Rows', sets: 3, reps: '10-12', notes: 'Use light weights' },
      ],
      isPublic: true,
      tags: ['beginner', 'strength', 'full-body'],
    },
    {
      name: 'Morning Yoga Flow',
      description: 'Gentle yoga routine to start your day energized',
      difficulty: 'beginner',
      category: 'flexibility',
      duration: 20,
      estimatedCalories: 60,
      exercises: [
        { name: 'Cat-Cow Stretch', duration: 60, notes: 'Warm up spine' },
        { name: 'Downward Dog', duration: 60, notes: 'Hold and breathe' },
        { name: 'Warrior I', duration: 30, notes: 'Each side' },
        { name: 'Tree Pose', duration: 30, notes: 'Each side for balance' },
        { name: 'Child\'s Pose', duration: 60, notes: 'Rest and relax' },
      ],
      isPublic: true,
      tags: ['yoga', 'flexibility', 'morning', 'stress-relief'],
    },
    {
      name: '30-Min Cardio Blast',
      description: 'Intensive cardio workout to burn maximum calories',
      difficulty: 'intermediate',
      category: 'cardio',
      duration: 30,
      estimatedCalories: 300,
      exercises: [
        { name: 'Warm-up Jog', duration: 300, notes: '5 minutes' },
        { name: 'High Knees', duration: 60, notes: 'Maximum intensity' },
        { name: 'Burpees', duration: 60, notes: 'As many as possible' },
        { name: 'Mountain Climbers', duration: 60, notes: 'Keep pace steady' },
        { name: 'Jump Rope', duration: 120, notes: '2 minutes' },
        { name: 'Cool-down Walk', duration: 300, notes: '5 minutes' },
      ],
      isPublic: true,
      tags: ['cardio', 'fat-burn', 'intermediate'],
    },
    {
      name: 'Full Body Power',
      description: 'Advanced strength workout targeting all major muscle groups',
      difficulty: 'advanced',
      category: 'strength',
      duration: 45,
      estimatedCalories: 250,
      exercises: [
        { name: 'Barbell Squats', sets: 4, reps: '8-10', notes: 'Heavy weight' },
        { name: 'Bench Press', sets: 4, reps: '8-10', notes: 'Progressive overload' },
        { name: 'Deadlifts', sets: 4, reps: '6-8', notes: 'Perfect form crucial' },
        { name: 'Pull-ups', sets: 3, reps: 'To failure', notes: 'Add weight if needed' },
        { name: 'Overhead Press', sets: 3, reps: '8-10', notes: 'Control the weight' },
      ],
      isPublic: true,
      tags: ['advanced', 'strength', 'muscle-building', 'compound'],
    },
  ];

  for (const template of defaultTemplates) {
    await WorkoutTemplate.findOneAndUpdate(
      { name: template.name },
      template,
      { upsert: true, new: true }
    );
  }
};

// @desc    Get all workout templates
// @route   GET /api/templates
// @access  Public
const getTemplates = async (req, res) => {
  try {
    const { difficulty, category } = req.query;
    let query = { isPublic: true };

    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    const templates = await WorkoutTemplate.find(query).sort({ usageCount: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Public
const getTemplateById = async (req, res) => {
  try {
    const template = await WorkoutTemplate.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Use template (increment usage count)
// @route   POST /api/templates/:id/use
// @access  Private
const useTemplate = async (req, res) => {
  try {
    const template = await WorkoutTemplate.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.usageCount += 1;
    await template.save();

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create custom template
// @route   POST /api/templates
// @access  Private
const createTemplate = async (req, res) => {
  try {
    const template = await WorkoutTemplate.create({
      ...req.body,
      createdBy: req.user._id,
      isPublic: false,
    });

    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  initializeTemplates,
  getTemplates,
  getTemplateById,
  useTemplate,
  createTemplate,
};
