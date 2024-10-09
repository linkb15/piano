import { render } from 'solid-js/web';
import App from './App';

import '@park-ui/tailwind-plugin/preset.css';
import './index.css';

const root = document.getElementById('root');
if (root) {
  render(() => <App />, root);
}
