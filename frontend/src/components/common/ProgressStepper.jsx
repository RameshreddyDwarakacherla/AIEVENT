import { Stepper, Step, StepLabel, StepContent, Button, Box, Typography, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ProgressStepper = ({ steps, activeStep, onStepClick, orientation = 'horizontal' }) => {
  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 3 }}>
      <Stepper activeStep={activeStep} orientation={orientation}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={step.completed}>
            <StepLabel
              optional={
                step.optional && (
                  <Typography variant="caption">Optional</Typography>
                )
              }
              StepIconComponent={step.completed ? CheckCircleIcon : undefined}
              sx={{
                cursor: onStepClick ? 'pointer' : 'default',
                '& .MuiStepLabel-label': {
                  fontWeight: activeStep === index ? 600 : 400
                }
              }}
              onClick={() => onStepClick && onStepClick(index)}
            >
              {step.label}
            </StepLabel>
            {orientation === 'vertical' && step.description && (
              <StepContent>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default ProgressStepper;
