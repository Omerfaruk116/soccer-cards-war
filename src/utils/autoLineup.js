import {
  getPositionGroup,
} from "../data/players";

const STAGE_CAPS = [
  30,
  40,
  50,
  60,
  70,
  80,
  85,
  90,
  95,
  99,
];

const SLOT_GROUPS = {
  forward: [
    "fw1",
    "fw2",
  ],

  midfield: [
    "mid1",
    "mid2",
    "mid3",
  ],

  defense: [
    "def1",
    "def2",
    "def3",
    "def4",
  ],

  goalkeeper: [
    "gk",
  ],
};

function isPlayerRented(
  game,
  playerId,
  now
) {
  return Boolean(
    game.rentalCenter
      ?.rentals?.some(
        (rental) =>
          rental.playerId ===
            playerId &&
          !rental.finished &&
          rental.endsAt >
            now
      )
  );
}

function isPlayerWithCoach(
  game,
  playerId,
  now
) {
  return Boolean(
    game.coaches
      ?.activeSessions?.some(
        (session) =>
          !session.finished &&
          session.endsAt >
            now &&
          session.playerIds?.includes(
            playerId
          )
      )
  );
}

function isPlayerTraining(
  game,
  playerId
) {
  return (
    game.training
      ?.playerId ===
    playerId
  );
}

function isPlayerAvailable(
  game,
  player,
  stageCap,
  now
) {
  if (!player) {
    return false;
  }

  if (player.sold) {
    return false;
  }

  if (
    player.overall >
      stageCap &&
    player.overall !== 100
  ) {
    return false;
  }

  if (
    isPlayerTraining(
      game,
      player.id
    )
  ) {
    return false;
  }

  if (
    isPlayerRented(
      game,
      player.id,
      now
    )
  ) {
    return false;
  }

  if (
    isPlayerWithCoach(
      game,
      player.id,
      now
    )
  ) {
    return false;
  }

  return true;
}

function sortBest(
  players
) {
  return [...players].sort(
    (a, b) => {
      if (
        b.overall !==
        a.overall
      ) {
        return (
          b.overall -
          a.overall
        );
      }

      return String(
        a.name
      ).localeCompare(
        String(
          b.name
        )
      );
    }
  );
}

export function buildBestLineup(
  game
) {
  if (
    !game ||
    !Array.isArray(
      game.collection
    )
  ) {
    return {
      success: false,

      message:
        "Oyuncu koleksiyonu bulunamadı.",
    };
  }

  const now =
    Date.now();

  const stageIndex =
    Math.max(
      0,
      Math.min(
        9,
        (Number(
          game.activeStage
        ) || 1) - 1
      )
    );

  const stageCap =
    STAGE_CAPS[
      stageIndex
    ];

  const available =
    game.collection.filter(
      (player) =>
        isPlayerAvailable(
          game,
          player,
          stageCap,
          now
        )
    );

  const groups = {
    forward: [],
    midfield: [],
    defense: [],
    goalkeeper: [],
  };

  available.forEach(
    (player) => {
      const group =
        player.positionGroup ||
        getPositionGroup(
          player.position
        );

      if (
        groups[group]
      ) {
        groups[group].push(
          player
        );
      }
    }
  );

  Object.keys(
    groups
  ).forEach(
    (group) => {
      groups[group] =
        sortBest(
          groups[group]
        );
    }
  );

  const requirements = {
    forward: 2,
    midfield: 3,
    defense: 4,
    goalkeeper: 1,
  };

  const names = {
    forward: "Forvet",
    midfield: "Orta Saha",
    defense: "Defans",
    goalkeeper: "Kaleci",
  };

  for (
    const [
      group,
      required,
    ] of Object.entries(
      requirements
    )
  ) {
    if (
      groups[group].length <
      required
    ) {
      return {
        success: false,

        message:
          `En iyi kadro kurulamadı. ` +
          `En az ${required} kullanılabilir ${names[group]} gerekiyor. ` +
          `Şu anda ${groups[group].length} tane var.`,
      };
    }
  }

  const formation = {};

  Object.entries(
    SLOT_GROUPS
  ).forEach(
    ([group, slots]) => {
      slots.forEach(
        (
          slotId,
          index
        ) => {
          formation[
            slotId
          ] =
            groups[group][
              index
            ].id;
        }
      );
    }
  );

  const selectedPlayers = [
    ...groups.forward.slice(
      0,
      2
    ),

    ...groups.midfield.slice(
      0,
      3
    ),

    ...groups.defense.slice(
      0,
      4
    ),

    ...groups.goalkeeper.slice(
      0,
      1
    ),
  ];

  const average =
    Math.round(
      selectedPlayers.reduce(
        (
          total,
          player
        ) =>
          total +
          player.overall,
        0
      ) /
        selectedPlayers.length
    );

  return {
    success: true,

    formation,

    squad:
      selectedPlayers.map(
        (player) =>
          player.id
      ),

    players:
      selectedPlayers,

    average,

    stageCap,

    message:
      `✅ En iyi kadro otomatik kuruldu. Ortalama GEN: ${average}`,
  };
}