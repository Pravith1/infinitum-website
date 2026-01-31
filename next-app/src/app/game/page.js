export const metadata = {
  title: 'Shadow Stick',
  description: 'Play Shadow Stick — a web game embedded in Infinitum.',
  icons: {
    icon: '/godot/my-game/game.icon.png',
    apple: '/godot/my-game/game.apple-touch-icon.png',
  },
  openGraph: {
    title: 'Shadow Stick',
    description: 'Play Shadow Stick — a web game embedded in Infinitum.',
    type: 'website',
    images: ['/godot/my-game/game.icon.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shadow Stick',
    description: 'Play Shadow Stick — a web game embedded in Infinitum.',
  },
};

import GameClient from './GameClient';

export default function GamePage() {
  return <GameClient />;
}
