import 'react-datepicker/dist/react-datepicker.css';
import './index.css';

import DatePicker from './DatePicker';
import { ko } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';

registerLocale('ko', ko);

export { DatePicker };
