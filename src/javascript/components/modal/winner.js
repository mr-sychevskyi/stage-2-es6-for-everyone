import { showModal } from './modal';
import { createFighterImage } from '../fighterPreview';

export function showWinnerModal(fighter) {
  const imgElement = createFighterImage(fighter);

  showModal({
    title: fighter.name,
    bodyElement: imgElement
  });
}
