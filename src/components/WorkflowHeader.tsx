import { useLanguage } from "../contexts/LanguageContext";

export function WorkflowHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('sidebar.workflows')}</h1>
      </div>
    </div>
  );
}