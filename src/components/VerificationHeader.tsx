import { useLanguage } from "../contexts/LanguageContext";

export function VerificationHeader() {
  const { t } = useLanguage();
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('verification.queue')}</h1>
      <p className="text-gray-600">23 {t('verification.itemsPending')}</p>
    </div>
  );
}