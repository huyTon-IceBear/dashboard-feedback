import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  feedback: icon('ic_file'),
  analytics: icon('ic_analytics'),
  task: icon('ic_order'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // Project
      // ----------------------------------------------------------------------
      {
        subheader: '',
        items: [
          {
            title: t('analytics'),
            path: paths.dashboard.root,
            icon: ICONS.analytics,
          },
          {
            title: t('Feedback'),
            path: paths.dashboard.feedback.root,
            icon: ICONS.feedback,
          },
          {
            title: t('Task'),
            path: paths.dashboard.task.root,
            icon: ICONS.task,
            children: [
              {
                title: 'Create',
                path: paths.dashboard.task.root,
                children: [
                  { title: 'Bugfix', path: paths.dashboard.task.new.bugfix },
                  { title: 'RFC', path: paths.dashboard.task.new.rfc },
                ],
              },
            ],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
