import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { intakeSchema } from './intakeSchema';
import { createChild } from '../../services/childService';
import FormProgress from './components/FormProgress/FormProgress';
import FormNav      from './components/FormNav/FormNav';
import BasicsStep      from './components/steps/BasicsStep/BasicsStep';
import ExperienceStep  from './components/steps/ExperienceStep/ExperienceStep';
import NapTimesStep    from './components/steps/NapTimesStep/NapTimesStep';
import ReviewStep      from './components/steps/ReviewStep/ReviewStep';

import styles from './IntakeFormPage.module.css';

const STEP_FIELDS = [
  ['childName', 'dateOfBirth'],           // Step 1
  ['experienceLevel', 'additionalNotes'], // Step 2
  ['napTimes'],                           // Step 3
  [],                                     // Step 4 (review — no new fields)
];

const TOTAL_STEPS = 4;

function IntakeFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(intakeSchema),
    mode: 'onTouched',
    defaultValues: {
      childName:       '',
      dateOfBirth:     '',
      experienceLevel: '',
      medicalFlags:    [],
      additionalNotes: '',
      napTimes:        [],
    },
  });

  const { handleSubmit, trigger, formState: { isSubmitting } } = methods;

  async function handleNext() {
    // Validate only the fields relevant to the current step
    const fieldsToValidate = STEP_FIELDS[currentStep - 1];
    const isValid = fieldsToValidate.length === 0
      ? true
      : await trigger(fieldsToValidate);

    if (!isValid) return;

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
      // Scroll back to top so the user sees the new step from the beginning
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last step — trigger full form submit
      handleSubmit(onSubmit)();
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function onSubmit(data) {
    try {
      await createChild(data);
      navigate('/booking');
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  return (
    <div className={styles.page}>
      {/* Page title header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Add Child Profile</h1>
      </header>

      {/* Sticky progress indicator */}
      <FormProgress currentStep={currentStep} />

      {/* Form body — FormProvider shares methods with all step components */}
      <FormProvider {...methods}>
        <main className={styles.content}>
          <div className={styles.stepBody}>
            {currentStep === 1 && <BasicsStep />}
            {currentStep === 2 && <ExperienceStep />}
            {currentStep === 3 && <NapTimesStep />}
            {currentStep === 4 && <ReviewStep />}
          </div>
        </main>
      </FormProvider>

      {/* Submit error — shown on review step if API call fails */}
      {submitError && (
        <p style={{ padding: '0 20px 8px', fontSize: '13px', color: 'var(--color-red)', textAlign: 'center' }}>
          {submitError}
        </p>
      )}

      {/* Sticky nav footer */}
      <FormNav
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        isSubmitting={isSubmitting}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  );
}

export default IntakeFormPage;