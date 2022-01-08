import 'react-datepicker/dist/react-datepicker.css';
import './index.css';

import { ko } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';
import DatePicker from './DatePicker';

registerLocale('ko', ko);

export { DatePicker };
