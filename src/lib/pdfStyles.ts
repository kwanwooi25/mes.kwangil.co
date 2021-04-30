import { Style } from '@react-pdf/types';

export const baseStyles: { [key: string]: Style } = {
  detailSection: {
    flex: 1,
    height: '100%',
    border: '1 solid #181818',
    display: 'flex',
    flexDirection: 'column',
  },
  detailSectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f7f7f7',
    borderBottom: '0.5 solid #181818',
    padding: 8,
  },
  detailSectionContent: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontSize: 13,
    lineHeight: 1.5,
    padding: 8,
  },

  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexColumnCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: { border: '1 solid #181818' },
  borderTop: { borderTop: '1 solid #181818' },
  borderRight: { borderRight: '1 solid #181818' },
  borderBottom: { borderBottom: '1 solid #181818' },
  borderLeft: { borderLeft: '1 solid #181818' },
  lightBorder: { border: '0.5 solid #181818' },
  lightBorderTop: { borderTop: '0.5 solid #181818' },
  lightBorderRight: { borderRight: '0.5 solid #181818' },
  lightBorderBottom: { borderBottom: '0.5 solid #181818' },
  lightBorderLeft: { borderLeft: '0.5 solid #181818' },
};
