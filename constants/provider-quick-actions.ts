import { ROUTES } from '@/constants/navigation';
import { t } from '@/lib/i18n';

export function getProviderQuickActions() {
  return [
    {
      title: t(
        'providerDashboard.quickActions.publishSingle.title'
      ),
      description: t(
        'providerDashboard.quickActions.publishSingle.desc'
      ),
      linkText: t(
        'providerDashboard.quickActions.publishSingle.link'
      ),
      href: ROUTES.PROVIDER.PROGRAMS.CREATE,
    },
    {
      title: t(
        'providerDashboard.quickActions.batchPublish.title'
      ),
      description: t(
        'providerDashboard.quickActions.batchPublish.desc'
      ),
      linkText: t(
        'providerDashboard.quickActions.batchPublish.link'
      ),
      href: ROUTES.PROVIDER.PROGRAMS.BULK,
    },
    {
      title: t(
        'providerDashboard.quickActions.exportEnrolment.title'
      ),
      description: t(
        'providerDashboard.quickActions.exportEnrolment.desc'
      ),
      linkText: t(
        'providerDashboard.quickActions.exportEnrolment.link'
      ),
      href: ROUTES.PROVIDER.PROGRAMS.EXPORT,
    },
  ];
}