import React from 'react';
import GifPlayer from 'react-gif-player';

import 'react-gif-player/dist/gifplayer.min.css';
import './style.css';

const Gif = ({ gif, still }) => <GifPlayer gif={gif} still={still} />;

export default Gif;
