import React from 'react';
import Icon from './Icon';

const steps = [
  { id: 1, title: 'Perfil', icon: 'user' },
  { id: 2, title: 'Experiencia', icon: 'briefcase' },
  { id: 3, title: 'Educacion', icon: 'book-open' },
  { id: 4, title: 'Finalizar', icon: 'flag' }
];

const Stepper = ({ currentStep, onStepClick, completedSteps }) => {
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.includes(step.id);
        const isClickable = step.id <= Math.max(...completedSteps, 1) + 1;

        return (
          <React.Fragment key={step.id}>
            <div
              className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isClickable ? 'clickable' : ''}`}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              <div className="stepper-circle">
                {isCompleted ? <Icon name="check" size={14} /> : <Icon name={step.icon} size={14} />}
              </div>
              <span className="stepper-title">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`stepper-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
