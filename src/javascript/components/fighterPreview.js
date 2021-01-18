import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  if (fighter) {
    const imgElement = createFighterImage(fighter);
    const infoElement = createElement({
      tagName: 'ul',
      className: 'fighter-preview__features',
    });

    const {_id, source, ...fighterOthersDetails} = fighter;

    Object.keys(fighterOthersDetails).forEach(feature => {
      const featureElement = createElement({
        tagName: 'li',
        className: `fighter-preview__features-item`,
      });

      const featureElementProperty = createElement({
        tagName: 'span',
        className: `fighter-preview__features-property`,
      });

      featureElementProperty.innerText = `${feature}: `;

      const featureElementValue = createElement({
        tagName: 'span',
        className: `fighter-preview__features-value`,
      });

      featureElementValue.innerText = fighterOthersDetails[feature];

      featureElement.append(featureElementProperty);
      featureElement.append(featureElementValue);
      infoElement.append(featureElement);
    });

    fighterElement.append(infoElement);
    fighterElement.append(imgElement);
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
