import { io } from 'socket.io-client';
import { CONFIG } from '../configs';

// "undefined" means the URL will be computed from the `window.location` object
const URL = CONFIG.API_URL != '' && CONFIG.API_URL != 'undefined' ? CONFIG.API_URL : 'http://snp0:5000';

export const socket = io(URL as string);