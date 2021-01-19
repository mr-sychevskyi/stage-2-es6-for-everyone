import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const {
        PlayerOneAttack,
        PlayerOneBlock,
        PlayerTwoAttack,
        PlayerTwoBlock,
        PlayerOneCriticalHitCombination,
        PlayerTwoCriticalHitCombination
      } = controls;

      const state = {
        'firstFighter': firstFighter,
        'secondFighter': secondFighter,
        'firstFighterInBlock': false,
        'secondFighterInBlock': false,
        attackerId: null,
        blockedState: false,
        criticalHit: false,
        gameOrder: 0
      };

      const activateBlockedState = () => setTimeout(() => state.blockedState = true, 10000);
      const firstFighterHealthBar = document.getElementById('left-fighter-indicator');
      const secondFighterHealthBar = document.getElementById('right-fighter-indicator');

      const updateHealthBarView = (fighterId, newHealth) => {
        const fighter = fighterId === 'firstFighter' ? firstFighter : secondFighter;
        const fighterHealthBar = fighterId === 'firstFighter' ? firstFighterHealthBar : secondFighterHealthBar;
        const prevHealth = fighter.health;

        fighterHealthBar.style.width = `${newHealth > 0 ? newHealth * 100 / prevHealth : 0}%`;
      };

      document.addEventListener('keydown', event => {
        const { attackerId } = state;
        if (event.code !== PlayerOneAttack
          && event.code !== PlayerTwoAttack
          && event.code !== PlayerOneBlock
          && event.code !== PlayerTwoBlock
        ) return;

        if (event.code === PlayerOneAttack) {
          if (state['firstFighterInBlock']) return;

          state.attackerId = 'firstFighter';
        }

        if (event.code === PlayerOneBlock) {
          state['firstFighterInBlock'] = true;
          return;
        }

        if (event.code === PlayerTwoAttack) {
          if (state['secondFighterInBlock']) return;

          state.attackerId = 'secondFighter';
        }

        if (event.code === PlayerTwoBlock) {
          state['secondFighterInBlock'] = true;
          return;
        }

        if (attackerId === 'firstFighter' && state['secondFighterInBlock']) {
          state['secondFighterInBlock'] = false;
          return;
        }

        if (attackerId === 'secondFighter' && state['firstFighterInBlock']) {
          state['firstFighterInBlock'] = false;
          return;
        }

        render();
      });

      const runCriticalHit = (hitInfo, codes) => {
        let pressed = new Set();

        document.addEventListener('keydown', event => {
          const { blockedState } = state;
          const attackerFighterInBlock =
            hitInfo.attackerId === 'firstFighter' && state['firstFighterInBlock'] ||
            hitInfo.attackerId === 'secondFighter' && state['secondFighterInBlock'];

          if (attackerFighterInBlock || blockedState) return;

          pressed.add(event.code);

          for (let code of codes) {
            if (!pressed.has(code)) {
              return;
            }
          }

          pressed.clear();

          state.criticalHit = true;
          state.attackerId = hitInfo.attackerId;
          state[hitInfo.defenderInBlock] = false;
          activateBlockedState();
          render();
        });

        document.addEventListener('keyup', event => {
          pressed.delete(event.code);
        });
      };

      runCriticalHit(
        {
          attackerId: 'firstFighter',
          defenderInBlock: 'secondFighterInBlock'
        },
        PlayerOneCriticalHitCombination
      );

      runCriticalHit(
        {
          attackerId: 'secondFighter',
          defenderInBlock: 'firstFighterInBlock'
        }, PlayerTwoCriticalHitCombination
      );

      const render = () => {
        const { attackerId, criticalHit, gameOrder } = state;
        const defenderId = attackerId === 'firstFighter' ? 'secondFighter' : 'firstFighter';
        const attacker = state[attackerId];
        const defender = state[defenderId];
        const damage = criticalHit ? attacker.attack * 2 : getDamage(attacker, defender);
        const prevHealth = defender.health;
        const newHealth = defender.health - damage;

        state[defenderId] = {
          ...defender,
          health: newHealth
        };

        const attackerHealth = state[attackerId].health;
        const defenderHealth = state[defenderId].health;

        updateHealthBarView(defenderId, newHealth);
        state['gameOrder'] = !!gameOrder ? 0 : 1;
        state[criticalHit] = false;

        if (!gameOrder) return;
        if (attackerHealth > 0 && defenderHealth > 0) return;

        const winnerId = attackerHealth > defenderHealth ? attackerId : defenderId;

        resolve(state[winnerId]);
      };
    }, 0);
  });
}

export function getDamage(attacker, defender) {
  const hitPower = getHitPower(attacker);
  const blockPower = getBlockPower(defender);
  const damage = hitPower - blockPower;

  return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() * 2;

  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() * 2;

  return fighter.defense * dodgeChance;
}
