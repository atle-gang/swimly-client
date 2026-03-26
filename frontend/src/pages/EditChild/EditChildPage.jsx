import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Baby } from 'lucide-react';
 
import ExperienceStep from '../Intake/components/steps/ExperienceStep/ExperienceStep';
import NapTimesStep   from '../Intake/components/steps/NapTimesStep/NapTimesStep';
import { getChild, updateChild } from '../../services/childService';
import { calcAgeMonths, formatAge } from '../Intake/intakeUtils';
 
import styles from './EditChildPage.module.css';
 
// Validation schema — only the editable fields
const editSchema = z.object({
  experienceLevel: z.string().min(1, 'Please select an experience level'),
  medicalFlags:    z.array(z.string()).default([]),
  additionalNotes: z.string().max(500).optional(),
  napTimes: z.array(
    z.object({ start: z.string().min(1), end: z.string().min(1) })
      .refine((n) => {
        const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
        return toMin(n.end) > toMin(n.start);
      }, { message: 'End must be after start', path: ['end'] })
  ).max(3).default([]),
});
 
function EditChildPage() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [child,     setChild]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving,  setIsSaving]  = useState(false);
  const [error,     setError]     = useState(null);
 
  const methods = useForm({
    resolver: zodResolver(editSchema),
    mode: 'onTouched',
    defaultValues: {
      experienceLevel: '',
      medicalFlags:    [],
      additionalNotes: '',
      napTimes:        [],
    },
  });
 
  const { handleSubmit, reset } = methods;
 
  // Load existing child data and pre-fill the form
  useEffect(() => {
    async function load() {
      try {
        const { child: data } = await getChild(id);
        setChild(data);
        // Pre-fill with existing values
        reset({
          experienceLevel: data.experience_level,
          medicalFlags:    data.medical_flags ?? [],
          additionalNotes: data.additional_notes ?? '',
          napTimes: (data.nap_times ?? []).map((n) => ({
            start: n.start_time,
            end:   n.end_time,
          })),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, reset]);
 
  async function onSubmit(data) {
    setIsSaving(true);
    setError(null);
    try {
      await updateChild(id, data);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }
 
  if (isLoading) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Edit Profile</h1>
        </header>
        <p className={styles.loadingMsg}>Loading…</p>
      </div>
    );
  }
 
  const ageMonths  = child ? calcAgeMonths(child.date_of_birth) : -1;
  const ageDisplay = formatAge(ageMonths);
 
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/profile')}>
          ←
        </button>
        <h1 className={styles.pageTitle}>Edit Profile</h1>
      </header>
 
      {/* Read-only child identity */}
      {child && (
        <div className={styles.identityCard}>
          <div className={styles.identityAvatar}>
            <Baby size={20} strokeWidth={1.8} />
          </div>
          <div>
            <p className={styles.identityName}>{child.name}</p>
            <p className={styles.identityMeta}>{ageDisplay}</p>
          </div>
        </div>
      )}
 
      <FormProvider {...methods}>
        <main className={styles.content}>
          <div className={styles.formBody}>
            <ExperienceStep />
            <div className={styles.divider} />
            <NapTimesStep />
          </div>
 
          {error && <p className={styles.errorMsg}>{error}</p>}
 
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              {isSaving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </main>
      </FormProvider>
    </div>
  );
}
 
export default EditChildPage;