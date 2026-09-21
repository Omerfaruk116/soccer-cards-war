import {
  getPositionGroup,
  randomItem,
  shuffle,
} from "../data/players";

const POSITION_POOL = [
  "forward",
  "forward",

  "midfield",
  "midfield",
  "midfield",

  "defense",
  "defense",
  "defense",
  "defense",

  "goalkeeper",
];

/*
  10 kişilik kadro:
  2 Forvet
  3 Orta Saha
  4 Defans
  1 Kaleci

  Bu 10 yuva içinden rastgele
  5 tanesi seçilir.

  Böylece:
  - maksimum 2 Forvet turu
  - maksimum 3 Orta Saha turu
  - maksimum 4 Defans turu
  - maksimum 1 Kaleci turu

  gelebilir.
*/
export function createRandomFiveRounds() {
  return shuffle(
    POSITION_POOL
  ).slice(0, 5);
}

export function getAvailablePlayersForRound(
  players,
  group,
  usedPlayerIds = []
) {
  return players.filter(
    (player) => {
      if (
        usedPlayerIds.includes(
          player.id
        )
      ) {
        return false;
      }

      const playerGroup =
        player.positionGroup ||
        getPositionGroup(
          player.position
        );

      return (
        playerGroup === group
      );
    }
  );
}

export function chooseOpponentForRound(
  opponentPlayers,
  group,
  usedOpponentIds = []
) {
  const available =
    getAvailablePlayersForRound(
      opponentPlayers,
      group,
      usedOpponentIds
    );

  if (!available.length) {
    return null;
  }

  return randomItem(
    available
  );
}

export function calculateRoundResult(
  player,
  opponent
) {
  if (
    player.overall >
    opponent.overall
  ) {
    return "win";
  }

  if (
    player.overall <
    opponent.overall
  ) {
    return "loss";
  }

  return "draw";
}

/*
  Etkinliğin özel parasını
  hesaplar.

  players.js içerisindeki:
  rewardBase
  rewardStep

  değerlerini kullanır.
*/
export function calculateEventCurrencyReward(
  event,
  match
) {
  const base =
    Number(
      event?.rewardBase
    ) || 0;

  const step =
    Number(
      event?.rewardStep
    ) || 0;

  const matchNumber =
    Math.max(
      1,
      Number(match) || 1
    );

  return Math.max(
    1,
    Math.floor(
      base +
        matchNumber *
          step
    )
  );
}

export function getRoundLabel(
  group
) {
  if (
    group === "forward"
  ) {
    return "FORVET";
  }

  if (
    group === "midfield"
  ) {
    return "ORTA SAHA";
  }

  if (
    group === "defense"
  ) {
    return "DEFANS";
  }

  if (
    group === "goalkeeper"
  ) {
    return "KALECİ";
  }

  return "OYUNCU";
}